import { useState } from 'react'
import Dashboard from './modules/Dashboard'
import HeapModule from './modules/HeapModule'
import CacheModule from './modules/CacheModule'
import CodeTracer from './modules/CodeTracer'
import PracticeExam from './modules/PracticeExam'
import TermsModule from './modules/TermsModule'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'heap', label: 'Heap Memory', icon: '📦' },
  { id: 'cache', label: 'Cache Performance', icon: '⚡' },
  { id: 'code', label: 'C Code Tracer', icon: '🔍' },
  { id: 'terms', label: 'Terms & Defs', icon: '📖' },
  { id: 'exam', label: 'Practice Exam', icon: '📝' },
]

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard')

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard setModule={setActiveModule} />
      case 'heap': return <HeapModule />
      case 'cache': return <CacheModule />
      case 'code': return <CodeTracer />
      case 'terms': return <TermsModule />
      case 'exam': return <PracticeExam />
      default: return <Dashboard setModule={setActiveModule} />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f1117' }}>
      {/* Sidebar */}
      <div style={{
        width: '220px',
        minWidth: '220px',
        backgroundColor: '#1a1d27',
        borderRight: '1px solid #2d3148',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 10,
      }}>
        {/* App Title */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #2d3148' }}>
          <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}>
            CS354 Exam 2
          </div>
          <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>
            March 26 · UW-Madison
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '8px 0', flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeModule === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 16px',
                  background: 'none',
                  border: 'none',
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  color: isActive ? '#3b82f6' : '#94a3b8',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  backgroundColor: isActive ? 'rgba(59,130,246,0.08)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#cbd5e1'
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#94a3b8'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #2d3148' }}>
          <div style={{ color: '#475569', fontSize: '11px' }}>CS354 Study Tool</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '220px',
        flex: 1,
        minHeight: '100vh',
        overflowY: 'auto',
        backgroundColor: '#0f1117',
      }}>
        {renderModule()}
      </div>
    </div>
  )
}
