import { useState } from 'react'
import './App.css'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import ParticipantList from './components/participants/ParticipantList'
import LotList from './components/lots/LotList'
import TiragePanel from './components/tirage/TiragePanel'
import ResultatsList from './components/resultats/ResultatsList'

const TABS = [
  { id: 'participants', label: 'Participants', icon: '👥' },
  { id: 'lots', label: 'Lots', icon: '🎁' },
  { id: 'tirage', label: 'Tirage', icon: '🎰' },
  { id: 'resultats', label: 'Résultats', icon: '🏆' },
]

function AppContent() {
  const [activeTab, setActiveTab] = useState('participants')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar activeTab={activeTab} tabs={TABS} onTabChange={setActiveTab} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {activeTab === 'participants' && <ParticipantList />}
        {activeTab === 'lots' && <LotList />}
        {activeTab === 'tirage' && <TiragePanel onTirageComplete={() => setActiveTab('resultats')} />}
        {activeTab === 'resultats' && <ResultatsList />}
      </main>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
