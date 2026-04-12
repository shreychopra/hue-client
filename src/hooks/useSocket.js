import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

// Single socket instance shared across the app
let socket = null

export function getSocket() {
  if (!socket) {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
    socket = io(SERVER_URL, {
      autoConnect: false
    })
  }
  return socket
}

export function useSocket(eventHandlers = {}) {
  const socket = getSocket()
  const handlersRef = useRef(eventHandlers)

  // Keep handlers ref up to date without re-running the effect
  useEffect(() => {
    handlersRef.current = eventHandlers
  })

  useEffect(() => {
    // Connect if not already connected
    if (!socket.connected) {
      socket.connect()
    }

    // Register all event handlers passed in
    const handlers = {}
    Object.keys(handlersRef.current).forEach(event => {
      handlers[event] = (...args) => handlersRef.current[event](...args)
      socket.on(event, handlers[event])
    })

    // Cleanup: remove handlers when component unmounts
    return () => {
      Object.keys(handlers).forEach(event => {
        socket.off(event, handlers[event])
      })
    }
  }, [socket])

  return socket
}