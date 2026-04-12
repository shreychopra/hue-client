import { useGameState } from './hooks/useGameState.js'
import Landing from './pages/Landing.jsx'
import Lobby from './pages/Lobby.jsx'
import Game from './pages/Game.jsx'

export default function App() {
  const { state, actions } = useGameState()
  const { phase } = state

  return (
    <>
      {/* Connection status — only shows when disconnected */}
      {!state.connected && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-950 border-b border-red-800 text-red-300 text-sm text-center py-2">
          reconnecting...
        </div>
      )}

      {phase === 'LANDING' && <Landing state={state} actions={actions} />}
      {phase === 'LOBBY' && <Lobby state={state} actions={actions} />}
      {['ROUND_START', 'PICKING', 'REVEAL', 'GAME_OVER', 'PLAY_AGAIN_OFFER'].includes(phase) && (
        <Game state={state} actions={actions} />
      )}
    </>
  )
}