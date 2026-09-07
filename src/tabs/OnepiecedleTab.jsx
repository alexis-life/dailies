import { useState } from 'react'
import { useHashSubTab } from '../lib/useHashTab'
import OnepiecedleClassicGame from './onepiecedle/OnepiecedleClassicGame'
import OnepiecedleClassicHelpModal from '../components/OnepiecedleClassicHelpModal'
import OnepiecedleDevilFruitGame from './onepiecedle/OnepiecedleDevilFruitGame'
import OnepiecedleDevilFruitHelpModal from '../components/OnepiecedleDevilFruitHelpModal'

const ONEPIECEDLE_GAMES = [
  { key: 'classic', label: 'classic', Component: OnepiecedleClassicGame, HelpModal: OnepiecedleClassicHelpModal },
  { key: 'devilfruit', label: 'devil fruit', Component: OnepiecedleDevilFruitGame, HelpModal: OnepiecedleDevilFruitHelpModal },
]

export default function OnepiecedleTab({ isSignedIn }) {
  const [activeGame, setActiveGame] = useHashSubTab('onepiecedle', ONEPIECEDLE_GAMES[0].key, ONEPIECEDLE_GAMES.map((g) => g.key))
  const [showHelp, setShowHelp] = useState(false)
  const activeConfig = ONEPIECEDLE_GAMES.find((g) => g.key === activeGame)
  const ActiveGameComponent = activeConfig.Component
  const ActiveHelpModal = activeConfig.HelpModal

  return (
    <>
      <div className="ax-card nyt-game-toggle">
        <nav className="ax-tabs">
          {ONEPIECEDLE_GAMES.map((g) => (
            <button
              key={g.key}
              type="button"
              className={`ax-tab ${activeGame === g.key ? 'is-active' : ''}`}
              onClick={() => setActiveGame(g.key)}
            >
              {g.label}
            </button>
          ))}
        </nav>
        {ActiveHelpModal && (
          <button type="button" className="ax-btn nyt-help-link" aria-label="how to play" onClick={() => setShowHelp(true)}>
            <span className="nyt-help-link-text">how to play</span>
            <span className="nyt-help-link-icon">i</span>
          </button>
        )}
      </div>
      <ActiveGameComponent isSignedIn={isSignedIn} />
      {showHelp && ActiveHelpModal && <ActiveHelpModal onClose={() => setShowHelp(false)} />}
    </>
  )
}
