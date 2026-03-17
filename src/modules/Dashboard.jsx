import { useState, useEffect } from 'react'

const EXAM_DATE = new Date('2026-03-26T00:00:00')

function getDaysUntil(date) {
  const now = new Date()
  const diff = date - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function getAccuracy(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function TopicCard({ label, storageKey, onStudy, color }) {
  const data = getAccuracy(storageKey)
  const pct = data && data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0

  return (
    <div style={{
      backgroundColor: '#1a1d27',
      border: '1px solid #2d3148',
      borderRadius: '8px',
      padding: '16px',
      flex: 1,
      minWidth: '180px',
    }}>
      <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
        {label}
      </div>
      {data && data.total > 0 ? (
        <>
          <div style={{ color: '#e2e8f0', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
            {pct}%
          </div>
          <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '10px' }}>
            {data.correct}/{data.total} correct
          </div>
          <div style={{ height: '4px', backgroundColor: '#22263a', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              width: `${pct}%`,
              height: '100%',
              backgroundColor: color,
              borderRadius: '2px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </>
      ) : (
        <>
          <div style={{ color: '#475569', fontSize: '14px', marginBottom: '10px' }}>Not started</div>
          <div style={{ height: '4px', backgroundColor: '#22263a', borderRadius: '2px' }} />
        </>
      )}
    </div>
  )
}

export default function Dashboard({ setModule }) {
  const [days, setDays] = useState(getDaysUntil(EXAM_DATE))

  useEffect(() => {
    const t = setInterval(() => setDays(getDaysUntil(EXAM_DATE)), 60000)
    return () => clearInterval(t)
  }, [])

  const examHistory = (() => {
    try { return JSON.parse(localStorage.getItem('exam_history') || '[]') } catch { return [] }
  })()

  return (
    <div style={{ padding: '32px 36px', maxWidth: '960px' }}>
      {/* Hero */}
      <div style={{
        backgroundColor: '#1a1d27',
        border: '1px solid #2d3148',
        borderRadius: '12px',
        padding: '28px 32px',
        marginBottom: '28px',
        background: 'linear-gradient(135deg, #1a1d27 0%, #1e2235 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{
              color: '#e2e8f0',
              fontSize: '32px',
              fontWeight: 700,
              margin: '0 0 6px',
              letterSpacing: '-0.5px',
            }}>
              CS354 Exam 2
            </h1>
            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>
              Operating Systems — UW-Madison
            </div>
            <div style={{ color: '#94a3b8', fontSize: '15px' }}>
              You&apos;ve got this.
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              backgroundColor: days <= 3 ? 'rgba(239,68,68,0.15)' : days <= 7 ? 'rgba(251,191,36,0.15)' : 'rgba(59,130,246,0.15)',
              border: `1px solid ${days <= 3 ? 'rgba(239,68,68,0.4)' : days <= 7 ? 'rgba(251,191,36,0.4)' : 'rgba(59,130,246,0.4)'}`,
              borderRadius: '8px',
              padding: '12px 20px',
              textAlign: 'center',
            }}>
              <div style={{
                color: days <= 3 ? '#ef4444' : days <= 7 ? '#fbbf24' : '#3b82f6',
                fontSize: '36px',
                fontWeight: 700,
                lineHeight: 1,
              }}>
                {days}
              </div>
              <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                days until exam
              </div>
              <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px' }}>
                March 26, 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Progress */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Topic Progress
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <TopicCard label="Heap Memory" storageKey="heap_accuracy" color="#3b82f6" />
          <TopicCard label="Cache Performance" storageKey="cache_accuracy" color="#14b8a6" />
          <TopicCard label="C Code Tracing" storageKey="code_accuracy" color="#a78bfa" />
        </div>
      </div>

      {/* Quick Start */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Quick Start
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: '📦 Study Heap', module: 'heap', color: '#3b82f6' },
            { label: '⚡ Study Cache', module: 'cache', color: '#14b8a6' },
            { label: '🔍 Trace Code', module: 'code', color: '#a78bfa' },
            { label: '📝 Mock Exam', module: 'exam', color: '#f59e0b' },
          ].map(btn => (
            <button
              key={btn.module}
              onClick={() => setModule(btn.module)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#22263a',
                border: `1px solid ${btn.color}40`,
                borderRadius: '6px',
                color: btn.color,
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = `${btn.color}20`
                e.currentTarget.style.borderColor = btn.color
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#22263a'
                e.currentTarget.style.borderColor = `${btn.color}40`
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two column: tips + exam history */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Exam Tips */}
        <div style={{
          flex: '1 1 300px',
          backgroundColor: '#1a1d27',
          border: '1px solid #2d3148',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>
            📌 What to Focus On
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { tip: 'Understand block coalescing direction', detail: 'Coalescing checks prev AND next blocks. Footer enables backward traversal.' },
              { tip: 'Practice tag/index/offset decomposition', detail: 'Given S, E, B, m — compute b=log2(B), s=log2(S), t=m-s-b. Apply to any hex address.' },
              { tip: 'Trace pointer arithmetic step by step', detail: 'Remember: p+n moves n×sizeof(*p) bytes. Pointer arithmetic is always element-based.' },
              { tip: 'Know your placement policies', detail: 'First-fit is tested most. Best-fit minimizes internal fragmentation. Next-fit is fastest.' },
              { tip: 'Cold vs conflict vs capacity misses', detail: 'Cold = first access. Conflict = two blocks hash to same set. Capacity = working set > cache.' },
            ].map((item, i) => (
              <li key={i} style={{ color: '#94a3b8', fontSize: '13px' }}>
                <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{item.tip}</span>
                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{item.detail}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Exam History */}
        <div style={{
          flex: '1 1 260px',
          backgroundColor: '#1a1d27',
          border: '1px solid #2d3148',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>
            📊 Exam History
          </div>
          {examHistory.length === 0 ? (
            <div style={{ color: '#475569', fontSize: '13px' }}>No exams taken yet. Start a mock exam to track your progress.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {examHistory.slice(-5).reverse().map((h, i) => {
                const pct = Math.round((h.score / h.total) * 100)
                return (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#22263a',
                    borderRadius: '6px',
                    padding: '8px 12px',
                  }}>
                    <div>
                      <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{h.date}</div>
                      <div style={{ color: '#64748b', fontSize: '11px' }}>{h.score}/{h.total} pts</div>
                    </div>
                    <div style={{
                      color: pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444',
                      fontSize: '16px',
                      fontWeight: 700,
                    }}>
                      {pct}%
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
