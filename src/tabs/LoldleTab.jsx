import { useState } from 'react'
import { useHashSubTab } from '../lib/useHashTab'
import LoldleClassicGame from './loldle/LoldleClassicGame'
import LoldleClassicHelpModal from '../components/LoldleClassicHelpModal'
import LoldleEmojiGame from './loldle/LoldleEmojiGame'
import LoldleEmojiHelpModal from '../components/LoldleEmojiHelpModal'

const LOLDLE_GAMES = [
  { key: 'classic', label: 'classic', Component: LoldleClassicGame, HelpModal: LoldleClassicHelpModal },
  { key: 'emoji', label: 'emoji', Component: LoldleEmojiGame, HelpModal: LoldleEmojiHelpModal },
]

export default function LoldleTab({ isSignedIn }) {
  const [activeGame, setActiveGame] = useHashSubTab('loldle', LOLDLE_GAMES[0].key, LOLDLE_GAMES.map((g) => g.key))
  const [showHelp, setShowHelp] = useState(false)
  const activeConfig = LOLDLE_GAMES.find((g) => g.key === activeGame)
  const ActiveGameComponent = activeConfig.Component
  const ActiveHelpModal = activeConfig.HelpModal

  return (
    <>
      <div className="ax-card nyt-game-toggle">
        <nav className="ax-tabs">
          {LOLDLE_GAMES.map((g) => (
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
