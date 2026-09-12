import { useState } from 'react'
import { useHashSubTab } from '../lib/useHashTab'
import ContextoGame from './daydash/ContextoGame'
import ContextoHelpModal from '../components/ContextoHelpModal'
import LetrecoGame from './daydash/LetrecoGame'
import LetrecoHelpModal from '../components/LetrecoHelpModal'
import ExpressoGame from './daydash/ExpressoGame'
import ExpressoHelpModal from '../components/ExpressoHelpModal'

const DAYDASH_GAMES = [
  { key: 'contexto', label: 'contexto', Component: ContextoGame, HelpModal: ContextoHelpModal },
  { key: 'letreco', label: 'letreco', Component: LetrecoGame, HelpModal: LetrecoHelpModal },
  { key: 'expresso', label: 'expresso', Component: ExpressoGame, HelpModal: ExpressoHelpModal },
]

export default function DaydashTab({ isSignedIn }) {
  const [activeGame, setActiveGame] = useHashSubTab('daydash', DAYDASH_GAMES[0].key, DAYDASH_GAMES.map((g) => g.key))
  const [showHelp, setShowHelp] = useState(false)
  const activeConfig = DAYDASH_GAMES.find((g) => g.key === activeGame)
  const ActiveGameComponent = activeConfig.Component
  const ActiveHelpModal = activeConfig.HelpModal

  return (
    <>
      <div className="ax-card nyt-game-toggle">
        <nav className="ax-tabs">
          {DAYDASH_GAMES.map((g) => (
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
