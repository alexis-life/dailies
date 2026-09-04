import { useEffect, useState } from 'react'

function tabFromHash(defaultTab, validTabs) {
  // Only the first segment is the top-level tab — a sub-tab hash like
  // #nyt/wordle should still resolve the outer tab to "nyt".
  const hash = window.location.hash.replace('#', '').split('/')[0]
  return validTabs.includes(hash) ? hash : defaultTab
}

// Keeps the active tab in the URL hash (e.g. #spots) so refreshing or
// sharing a link lands back on the same tab, and browser back/forward work.
export function useHashTab(defaultTab, validTabs) {
  const [activeTab, setActiveTabState] = useState(() => tabFromHash(defaultTab, validTabs))

  useEffect(() => {
    function onHashChange() {
      setActiveTabState(tabFromHash(defaultTab, validTabs))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [defaultTab, validTabs])

  function setActiveTab(tab) {
    setActiveTabState(tab)
    if (window.location.hash !== `#${tab}`) window.location.hash = tab
  }

  return [activeTab, setActiveTab]
}

function subTabFromHash(parentTab, defaultTab, validTabs) {
  const parts = window.location.hash.replace('#', '').split('/')
  if (parts[0] !== parentTab) return defaultTab
  return validTabs.includes(parts[1]) ? parts[1] : defaultTab
}

// Same idea as useHashTab, but for a second hash segment nested under a
// parent tab (e.g. #nyt/wordle) — so a game within the nyt tab is also
// directly linkable/shareable and survives a refresh.
export function useHashSubTab(parentTab, defaultTab, validTabs) {
  const [activeSubTab, setActiveSubTabState] = useState(() => subTabFromHash(parentTab, defaultTab, validTabs))

  useEffect(() => {
    function onHashChange() {
      setActiveSubTabState(subTabFromHash(parentTab, defaultTab, validTabs))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [parentTab, defaultTab, validTabs])

  function setActiveSubTab(tab) {
    setActiveSubTabState(tab)
    const target = `${parentTab}/${tab}`
    if (window.location.hash !== `#${target}`) window.location.hash = target
  }

  return [activeSubTab, setActiveSubTab]
}
