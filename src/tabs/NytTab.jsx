import { useState } from 'react'
import WordleGame from './nyt/WordleGame'
import WordleHelpModal from '../components/WordleHelpModal'

function ComingSoon({ label }) {
  return (
    <div className="ax-card">
      <p className="ax-empty">{label} tracking is coming soon.</p>
    </div>
  )
}

const NYT_GAMES = [
  { key: 'wordle', label: 'wordle', Component: WordleGame, HelpModal: WordleHelpModal },
  { key: 'connections', label: 'connections', Component: () => <ComingSoon label="connections" /> },
  { key: 'strands', label: 'strands', Component: () => <ComingSoon label="strands" /> },
]

export default function NytTab({ isSignedIn }) {
  const [activeGame, setActiveGame] = useState(NYT_GAMES[0].key)
  const [showHelp, setShowHelp] = useState(false)
  const activeConfig = NYT_GAMES.find((g) => g.key === activeGame)
  const ActiveGameComponent = activeConfig.Component
  const ActiveHelpModal = activeConfig.HelpModal

  return (
    <>
      <div className="nyt-game-toggle">
        {NYT_GAMES.map((g) => (
          <button
            key={g.key}
            type="button"
            className={`ax-btn nyt-game-toggle-btn ${activeGame === g.key ? 'ax-btn--solid' : ''}`}
            onClick={() => setActiveGame(g.key)}
          >
            {g.label}
          </button>
        ))}
        {ActiveHelpModal && (
          <button type="button" className="ax-btn nyt-help-link" onClick={() => setShowHelp(true)}>
            how to play
          </button>
        )}
      </div>
      <ActiveGameComponent isSignedIn={isSignedIn} />
      {showHelp && ActiveHelpModal && <ActiveHelpModal onClose={() => setShowHelp(false)} />}
    </>
  )
}
