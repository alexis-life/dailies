import { useState } from 'react'
import { useHashSubTab } from '../lib/useHashTab'
import WordleGame from './nyt/WordleGame'
import WordleHelpModal from '../components/WordleHelpModal'
import ConnectionsGame from './nyt/ConnectionsGame'
import ConnectionsHelpModal from '../components/ConnectionsHelpModal'
import StrandsGame from './nyt/StrandsGame'
import StrandsHelpModal from '../components/StrandsHelpModal'

const NYT_GAMES = [
  { key: 'wordle', label: 'wordle', Component: WordleGame, HelpModal: WordleHelpModal },
  { key: 'connections', label: 'connections', Component: ConnectionsGame, HelpModal: ConnectionsHelpModal },
  { key: 'strands', label: 'strands', Component: StrandsGame, HelpModal: StrandsHelpModal },
]

export default function NytTab({ isSignedIn }) {
  const [activeGame, setActiveGame] = useHashSubTab('nyt', NYT_GAMES[0].key, NYT_GAMES.map((g) => g.key))
  const [showHelp, setShowHelp] = useState(false)
  const activeConfig = NYT_GAMES.find((g) => g.key === activeGame)
  const ActiveGameComponent = activeConfig.Component
  const ActiveHelpModal = activeConfig.HelpModal

  return (
    <>
      <div className="ax-card nyt-game-toggle">
        <nav className="ax-tabs">
          {NYT_GAMES.map((g) => (
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
