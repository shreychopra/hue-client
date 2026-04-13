import { useGameState } from './hooks/useGameState'
import Landing from './pages/Landing'
import Lobby from './pages/Lobby'
import Game from './pages/Game'

export default function App() {
  const { state, actions } = useGameState()
  const { phase } = state

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#1c1c1c' }}
    >
      {!state.connected && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 text-gray-400 text-sm text-center py-2">
          connecting... (first load may take 30 seconds)
        </div>
      )}

      {phase === 'LANDING' && <Landing state={state} actions={actions} />}
      {phase === 'LOBBY' && <Lobby state={state} actions={actions} />}
      {['ROUND_START', 'PICKING', 'REVEAL', 'GAME_OVER', 'PLAY_AGAIN_OFFER'].includes(phase) && (
        <Game state={state} actions={actions} />
      )}
    </div>
  )
}