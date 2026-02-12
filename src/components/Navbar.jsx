import { useApp } from '../context/AppContext'

export default function Navbar({ activeTab, tabs, onTabChange }) {
  const { participants, lots } = useApp()

  const counts = {
    participants: participants.length,
    lots: lots.length,
  }

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <h1 className="text-xl font-bold text-slate-800">🎲 Tirage au Sort</h1>
        </div>
        <nav className="flex gap-1 pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {counts[tab.id] !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
