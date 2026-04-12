import { useState, useCallback } from 'react'
import { useSocket, getSocket } from './useSocket'

const initialState = {
  // Connection
  connected: false,

  // Room
  roomCode: null,
  players: [],
  hostId: null,
  isHost: false,
  mySocketId: null,
  myName: null,

  // Game
  phase: 'LANDING',
  round: 0,
  totalRounds: 5,
  currentWord: null,
  timeLeft: 20,
  submissions: {},
  roundScores: {},
  averageColour: null,
  totalScores: {},
  roundHistory: [],  // [{ word, submissions, average, scores }]

  // Error
  error: null
}

export function useGameState() {
  const [state, setState] = useState(initialState)

  const mergeState = (updates) => {
    setState(prev => ({ ...prev, ...updates, error: null }))
  }

  const socket = useSocket({
    connect: () => {
      const socket = getSocket()
      mergeState({ connected: true, mySocketId: socket.id, error: null })
    },

    disconnect: () => {
      // Only show error if we're mid-game, not if voluntarily leaving
      setState(prev => {
        if (prev.phase === 'LANDING') return prev
        return { ...prev, connected: false, error: 'Connection lost. Please rejoin your room.' }
      })
    },

    room_created: ({ code, players, hostId }) => {
      const socket = getSocket()
      mergeState({
        roomCode: code,
        players,
        hostId,
        isHost: socket.id === hostId,
        phase: 'LOBBY'
      })
    },

    room_joined: ({ code, players, hostId }) => {
      const socket = getSocket()
      mergeState({
        roomCode: code,
        players,
        hostId,
        isHost: socket.id === hostId,
        phase: 'LOBBY'
      })
    },

    player_joined: ({ players }) => {
      mergeState({ players })
    },

    player_left: ({ players, hostId }) => {
      const socket = getSocket()
      setState(prev => ({
        ...prev,
        players,
        hostId,
        isHost: socket.id === hostId
      }))
    },

    promoted_to_host: () => {
      const socket = getSocket()
      mergeState({ isHost: true, hostId: socket.id })
    },

    game_started: () => {
      mergeState({ totalScores: {}, roundHistory: [] })
    },

    round_start: ({ round, word }) => {
      mergeState({
        phase: 'ROUND_START',
        round,
        currentWord: word,
        submissions: {},
        roundScores: {},
        averageColour: null,
        timeLeft: 20
      })
    },

    timer_tick: ({ timeLeft }) => {
      mergeState({ timeLeft })
    },

    timer_done: () => {
      mergeState({ timeLeft: 0 })
    },

    picking_start: () => {
      mergeState({ phase: 'PICKING' })
    },

    round_reveal: ({ submissions, scores, average }) => {
      setState(prev => {
        const totalScores = { ...prev.totalScores }
        Object.keys(scores).forEach(name => {
          totalScores[name] = (totalScores[name] || 0) + scores[name]
        })
        const roundHistory = [
          ...prev.roundHistory,
          { word: prev.currentWord, submissions, scores, average }
        ]
        return {
          ...prev,
          phase: 'REVEAL',
          submissions,
          roundScores: scores,
          averageColour: average,
          totalScores,
          roundHistory
        }
      })
    },

    game_over: ({ scores }) => {
      setState(prev => ({
        ...prev,
        phase: 'GAME_OVER',
        totalScores: scores
      }))
    },

    game_reset: ({ players, hostId }) => {
      const socket = getSocket()
      const amHost = socket.id === hostId
      setState(prev => ({
        ...prev,
        // Host goes straight to lobby, participants see the offer screen
        phase: amHost ? 'LOBBY' : 'PLAY_AGAIN_OFFER',
        players,
        hostId,
        isHost: amHost,
        round: 0,
        currentWord: null,
        submissions: {},
        roundScores: {},
        averageColour: null,
        totalScores: {},
        roundHistory: [],
        error: null
      }))
    },

    game_ended_early: ({ message }) => {
      mergeState({
        phase: 'LOBBY',
        error: message,
        round: 0,
        currentWord: null,
        submissions: {},
        roundScores: {},
        averageColour: null,
        totalScores: {}
      })
    },

    error: ({ message }) => {
      setState(prev => ({ ...prev, error: message }))
    }
  })

  const actions = {
    createRoom: useCallback((name) => {
      setState(prev => ({ ...prev, myName: name, error: null }))
      socket.emit('create_room', { name })
    }, [socket]),

    joinRoom: useCallback((code, name) => {
      setState(prev => ({ ...prev, myName: name, error: null }))
      socket.emit('join_room', { code, name })
    }, [socket]),

    startGame: useCallback(() => {
      socket.emit('start_game', { code: state.roomCode })
    }, [socket, state.roomCode]),

    submitColour: useCallback((hsb) => {
      socket.emit('submit_colour', {
        code: state.roomCode,
        colour: hsb,
        name: state.myName
      })
    }, [socket, state.roomCode, state.myName]),

    nextRound: useCallback(() => {
      socket.emit('next_round', { code: state.roomCode })
    }, [socket, state.roomCode]),

    playAgain: useCallback(() => {
      socket.emit('play_again', { code: state.roomCode })
    }, [socket, state.roomCode]),

    leaveRoom: useCallback(() => {
      const s = getSocket()
      // Tell server first, then clean up locally
      s.emit('leave_room')
      // Brief delay so server processes leave_room before disconnect fires
      setTimeout(() => {
        s.disconnect()
        setState(initialState)
        setTimeout(() => s.connect(), 50)
      }, 200)
    }, [socket]),

    joinNextGame: useCallback(() => {
      const s = getSocket()
      s.emit('join_room', { code: state.roomCode, name: state.myName })
    }, [socket, state.roomCode, state.myName]),
  }

  return { state, actions }
}