import { useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { useSession } from './lib/useSession'
import { useHashTab } from './lib/useHashTab'
import LoginScreen from './components/LoginScreen'
import HelpModal from './components/HelpModal'
import SpotsTab from './tabs/SpotsTab'

const TABS = [
  { key: 'spots', label: 'spots', Component: SpotsTab, HelpModal },
]

export default function App() {
  const session = useSession()
  const [showLogin, setShowLogin] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [activeTab, setActiveTab] = useHashTab(TABS[0].key, TABS.map((tab) => tab.key))

  const isSignedIn = Boolean(session)
  const activeTabConfig = TABS.find((tab) => tab.key === activeTab)
  const ActiveTabComponent = activeTabConfig?.Component
  const ActiveHelpModal = activeTabConfig?.HelpModal

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <>
      <header className="ax-header">
        <div className="ax-header-titles dailies-header-titles">
          <div>
            <h1 className="ax-title">dailies tracker</h1>
            <p className="ax-subtitle">personal results tracker for your daily games</p>
          </div>
          <div className="dailies-account-actions">
            {session === undefined ? null : isSignedIn ? (
              <button className="ax-btn dailies-account-link" onClick={handleSignOut}>sign out</button>
            ) : (
              <button className="ax-btn dailies-account-link" onClick={() => setShowLogin(true)}>sign in</button>
            )}
          </div>
        </div>
        <div className="ax-tabs-row">
          <div className="ax-tabs-inner">
            <nav className="ax-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`ax-tab ${activeTab === tab.key ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            {ActiveHelpModal && (
              <button className="ax-btn dailies-account-link tabs-help-link" onClick={() => setShowHelp(true)}>
                how to play
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="page-content">
        {ActiveTabComponent && <ActiveTabComponent isSignedIn={isSignedIn} />}
      </main>

      {showLogin && <LoginScreen onClose={() => setShowLogin(false)} />}
      {showHelp && ActiveHelpModal && <ActiveHelpModal onClose={() => setShowHelp(false)} />}
    </>
  )
}
