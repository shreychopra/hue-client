import RoundStart from '../components/game/RoundStart'
import Picking from '../components/game/Picking'
import Reveal from '../components/game/Reveal'
import GameOver from '../components/game/GameOver'
import PlayAgainOffer from '../components/game/PlayAgainOffer'

export default function Game({ state, actions }) {
  const { phase } = state

  return (
    <>
      {phase === 'ROUND_START' && <RoundStart state={state} />}
      {phase === 'PICKING' && <Picking state={state} actions={actions} />}
      {phase === 'REVEAL' && <Reveal state={state} actions={actions} />}
      {phase === 'GAME_OVER' && <GameOver state={state} actions={actions} />}
      {phase === 'PLAY_AGAIN_OFFER' && <PlayAgainOffer state={state} actions={actions} />}
    </>
  )
}