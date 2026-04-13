import { useGameState } from './hooks/useGameState'
import Landing from './pages/Landing'
import Lobby from './pages/Lobby'
import Game from './pages/Game'
import Privacy from './pages/Privacy'

export default function App() {
  const { state, actions } = useGameState()
  const { phase } = state

  if (window.location.pathname === '/privacy') {
    return <Privacy />
  }

  return (
    <>
      {!state.connected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: '#111', borderBottom: '1px solid #222',
          color: '#666', fontSize: 12, textAlign: 'center', padding: '8px'
        }}>
          connecting...
        </div>
      )}
      {phase === 'LANDING' && <Landing state={state} actions={actions} />}
      {phase === 'LOBBY' && <Lobby state={state} actions={actions} />}
      {['ROUND_START','PICKING','REVEAL','GAME_OVER','PLAY_AGAIN_OFFER'].includes(phase) && (
        <Game state={state} actions={actions} />
      )}
    </>
  )
}