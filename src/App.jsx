import { useState } from 'react'
import './App.css'
import { AppProvider } from './context/AppContext'
import Home from './components/Home'
import Navbar from './components/Navbar'
import ParticipantList from './components/participants/ParticipantList'
import LotList from './components/lots/LotList'
import TiragePanel from './components/tirage/TiragePanel'
import ResultatsList from './components/resultats/ResultatsList'

const TABS = [
  { id: 'participants', label: 'Participants' },
  { id: 'lots', label: 'Lots' },
  { id: 'tirage', label: 'Tirage' },
  { id: 'resultats', label: 'Résultats' },
]

function AppContent() {
  const [vue, setVue] = useState('accueil')
  const [activeTab, setActiveTab] = useState('participants')

  if (vue === 'accueil') return <Home onEnter={() => setVue('app')} />

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        tabs={TABS}
        onTabChange={setActiveTab}
        onHome={() => setVue('accueil')}
      />
      <main style={{ flex: 1, width: '100%', maxWidth: 1120, margin: '0 auto', padding: '36px 32px 96px' }}>
        {activeTab === 'participants' && <ParticipantList />}
        {activeTab === 'lots' && <LotList />}
        {activeTab === 'tirage' && <TiragePanel onTirageComplete={() => setActiveTab('resultats')} />}
        {activeTab === 'resultats' && <ResultatsList onGoTirage={() => setActiveTab('tirage')} />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
