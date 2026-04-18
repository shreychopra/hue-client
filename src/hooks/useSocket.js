import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

let socket = null
const SESSION_KEY = 'hue_session_id'

function getOrCreateSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function getSessionId() {
  return getOrCreateSessionId()
}

export function getSocket() {
  if (!socket) {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
    socket = io(SERVER_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

export function useSocket(eventHandlers = {}) {
  const socket = getSocket()
  const handlersRef = useRef(eventHandlers)

  useEffect(() => {
    handlersRef.current = eventHandlers
  })

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    const handlers = {}
    Object.keys(handlersRef.current).forEach(event => {
      handlers[event] = (...args) => handlersRef.current[event](...args)
      socket.on(event, handlers[event])
    })

    return () => {
      Object.keys(handlers).forEach(event => {
        socket.off(event, handlers[event])
      })
    }
  }, [socket])

  return socket
}