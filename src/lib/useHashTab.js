import { useEffect, useState } from 'react'

function tabFromHash(defaultTab, validTabs) {
  const hash = window.location.hash.replace('#', '')
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
