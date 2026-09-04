import { useState } from 'react'
import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import Home from './components/Home'
import Navbar from './components/Navbar'
import GiveawayList from './components/giveaways/GiveawayList'
import ParticipantList from './components/participants/ParticipantList'
import LotList from './components/lots/LotList'
import TiragePanel from './components/tirage/TiragePanel'
import ResultatsList from './components/resultats/ResultatsList'
import { IconGift, IconArrowLeft } from './components/ui/Icons'
import { APP_TITLE } from './constants'

const TABS = [
  { id: 'participants', label: 'Participants' },
  { id: 'lots', label: 'Lots' },
  { id: 'tirage', label: 'Tirage' },
  { id: 'resultats', label: 'Résultats' },
]

/** En-tête simple de l'écran « liste des giveaways », sans les onglets internes. */
function EnteteGiveaways({ onHome }) {
  return (
    <header style={{ padding: '22px 32px 0', borderBottom: '2px solid var(--color-divider)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto 22px', display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ width: 38, height: 38, background: 'var(--color-accent)', display: 'grid', placeItems: 'center', flex: 'none' }}>
          <IconGift size={20} stroke="var(--color-on-accent)" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 23, lineHeight: 1.05, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            {APP_TITLE}
          </div>
          <div style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            Choisissez un giveaway à gérer
          </div>
        </div>
        <div style={{ marginLeft: 'auto', paddingBottom: 2 }}>
          <button className="btn btn-secondary" onClick={onHome}>
            <IconArrowLeft size={15} />
            Accueil
          </button>
        </div>
      </div>
    </header>
  )
}

/** Un giveaway ouvert : ses propres onglets Participants / Lots / Tirage / Résultats. */
function GiveawayContent({ activeTab, setActiveTab, onExit }) {
  const { giveawayActif } = useApp()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        tabs={TABS}
        onTabChange={setActiveTab}
        onHome={onExit}
        homeLabel="Giveaways"
        titre={giveawayActif?.nom}
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

function AppContent() {
  const [vue, setVue] = useState('accueil')
  const [activeTab, setActiveTab] = useState('participants')
  const { selectionnerGiveaway } = useApp()

  if (vue === 'accueil') return <Home onEnter={() => setVue('giveaways')} />

  if (vue === 'giveaway') {
    return (
      <GiveawayContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExit={() => setVue('giveaways')}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <EnteteGiveaways onHome={() => setVue('accueil')} />
      <main style={{ flex: 1, width: '100%', maxWidth: 1120, margin: '0 auto', padding: '36px 32px 96px' }}>
        <GiveawayList onOpen={(id) => {
          selectionnerGiveaway(id)
          setActiveTab('participants')
          setVue('giveaway')
        }} />
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
