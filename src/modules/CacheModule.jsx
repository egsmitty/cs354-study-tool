import { useState, useCallback } from 'react'
import { cacheProblems } from '../data/cacheProblems'

function shuffleAndPick(arr, n) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

function log2(n) {
  return Math.round(Math.log2(n))
}

function hexToBin(hexStr, bits) {
  const num = parseInt(hexStr, 16)
  return num.toString(2).padStart(bits, '0')
}

function decompose(binStr, b, s, t) {
  const offset = binStr.slice(t + s)
  const index = binStr.slice(t, t + s)
  const tag = binStr.slice(0, t)
  return { tag, index, offset }
}

function SectionHeader({ children }) {
  return (
    <div style={{
      color: '#64748b', fontSize: '11px', textTransform: 'uppercase',
      letterSpacing: '0.1em', marginBottom: '14px', paddingBottom: '8px',
      borderBottom: '1px solid #2d3148',
    }}>
      {children}
    </div>
  )
}

function ProblemCard({ problem, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const letters = ['A', 'B', 'C', 'D']

  return (
    <div style={{
      backgroundColor: '#1a1d27', border: '1px solid #2d3148',
      borderRadius: '8px', padding: '20px', marginBottom: '12px',
    }}>
      <div style={{
        backgroundColor: '#0f1117', border: '1px solid #374151',
        borderRadius: '4px', padding: '6px 10px',
        color: '#14b8a6', fontSize: '12px', fontFamily: 'monospace',
        marginBottom: '12px', display: 'inline-block',
      }}>
        {problem.params}
      </div>
      <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500, marginBottom: '14px', lineHeight: 1.5 }}>
        {problem.id}. {problem.question}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {problem.options.map((opt, idx) => {
          let bg = '#22263a', border = '1px solid #374151', color = '#94a3b8'
          if (selected === idx && !revealed) { bg = 'rgba(59,130,246,0.15)'; border = '1px solid #3b82f6'; color = '#93c5fd' }
          if (revealed && idx === problem.answer) { bg = 'rgba(34,197,94,0.15)'; border = '1px solid #22c55e'; color = '#86efac' }
          if (revealed && selected === idx && idx !== problem.answer) { bg = 'rgba(239,68,68,0.15)'; border = '1px solid #ef4444'; color = '#fca5a5' }
          return (
            <button key={idx} onClick={() => !revealed && setSelected(idx)}
              style={{ display: 'flex', gap: '10px', padding: '9px 14px', backgroundColor: bg, border, borderRadius: '6px', color, fontSize: '13px', cursor: revealed ? 'default' : 'pointer', textAlign: 'left' }}>
              <span style={{ fontWeight: 600 }}>{letters[idx]})</span> {opt}
              {revealed && idx === problem.answer && <span style={{ marginLeft: 'auto' }}>✓</span>}
              {revealed && selected === idx && idx !== problem.answer && <span style={{ marginLeft: 'auto' }}>✗</span>}
            </button>
          )
        })}
      </div>
      {!revealed ? (
        <button onClick={() => { if (selected !== null) { setRevealed(true); onAnswer(selected === problem.answer) } }}
          disabled={selected === null}
          style={{ padding: '8px 16px', backgroundColor: selected !== null ? '#14b8a6' : '#22263a', border: '1px solid ' + (selected !== null ? '#14b8a6' : '#374151'), borderRadius: '6px', color: selected !== null ? '#fff' : '#475569', fontSize: '13px', cursor: selected !== null ? 'pointer' : 'not-allowed' }}>
          Check Answer
        </button>
      ) : (
        <div style={{ backgroundColor: '#0f1117', border: '1px solid #374151', borderRadius: '6px', padding: '12px', color: '#94a3b8', fontSize: '13px', lineHeight: 1.6 }}>
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>Explanation: </span>{problem.explanation}
        </div>
      )}
    </div>
  )
}

// Step-through mode
const WALKTHROUGH_PARAMS = { S: 4, E: 1, B: 4, m: 8 }
const WALKTHROUGH_ACCESSES = [0x00, 0x04, 0x08, 0x00, 0x10, 0x04]

function buildWalkthroughSteps() {
  const { S, E, B, m } = WALKTHROUGH_PARAMS
  const b = log2(B), s = log2(S), t = m - s - b
  const cache = Array.from({ length: S }, () => Array.from({ length: E }, () => ({ valid: false, tag: null })))
  const steps = []

  for (const addr of WALKTHROUGH_ACCESSES) {
    const bin = addr.toString(2).padStart(m, '0')
    const offsetBin = bin.slice(t + s)
    const indexBin = bin.slice(t, t + s)
    const tagBin = bin.slice(0, t)
    const setIdx = parseInt(indexBin, 2)
    const tagVal = parseInt(tagBin, 2)
    const addrHex = `0x${addr.toString(16).toUpperCase().padStart(2, '0')}`

    const line = cache[setIdx].find(l => l.valid && l.tag === tagVal)
    const hit = !!line

    if (!hit) {
      const emptySlot = cache[setIdx].findIndex(l => !l.valid)
      if (emptySlot !== -1) cache[setIdx][emptySlot] = { valid: true, tag: tagVal }
      else cache[setIdx][0] = { valid: true, tag: tagVal }
    }

    steps.push([
      { label: 'Step 1: Convert to binary', content: `${addrHex} = ${bin} (${m}-bit address)`, highlight: 'all' },
      { label: 'Step 2: Extract offset bits', content: `Rightmost b=${b} bits = "${offsetBin}" = byte offset ${parseInt(offsetBin, 2)}`, highlight: 'offset' },
      { label: 'Step 3: Extract index bits', content: `Next s=${s} bits = "${indexBin}" = set index ${setIdx}`, highlight: 'index' },
      { label: 'Step 4: Extract tag bits', content: `Remaining t=${t} bits = "${tagBin}" = tag value ${tagVal}`, highlight: 'tag' },
      { label: 'Step 5: Check cache', content: `Set ${setIdx}: look for tag=${tagVal} → ${hit ? '✓ HIT!' : '✗ MISS — load block into set ' + setIdx}`, highlight: hit ? 'hit' : 'miss' },
    ])
  }
  return steps
}

export default function CacheModule() {
  const [S, setS] = useState(4)
  const [E, setE] = useState(2)
  const [B, setB] = useState(8)
  const [m, setM] = useState(16)

  const b = log2(B), s = log2(S), t = m - s - b

  // Address decomposition
  const [addrInput, setAddrInput] = useState('0x1A3F')
  const [accessLog, setAccessLog] = useState([])
  const [cacheState, setCacheState] = useState(() =>
    Array.from({ length: 4 }, () => Array.from({ length: 2 }, () => ({ valid: false, tag: null, lru: 0 })))
  )
  const [lruCounter, setLruCounter] = useState(0)

  const simulateAccess = useCallback(() => {
    let addr
    try { addr = parseInt(addrInput, 16) } catch { return }
    if (isNaN(addr)) return

    const binStr = addr.toString(2).padStart(m, '0')
    const { tag: tagBin, index: indexBin, offset: offsetBin } = decompose(binStr, b, s, t)
    const setIdx = parseInt(indexBin, 2) || 0
    const tagVal = parseInt(tagBin, 2) || 0
    const addrHex = `0x${addr.toString(16).toUpperCase().padStart(4, '0')}`

    const newCache = cacheState.map(set => set.map(l => ({ ...l })))
    while (newCache.length < S) newCache.push(Array.from({ length: E }, () => ({ valid: false, tag: null, lru: 0 })))

    const set = newCache[setIdx % S] || Array.from({ length: E }, () => ({ valid: false, tag: null, lru: 0 }))
    const hitLine = set.findIndex(l => l.valid && l.tag === tagVal)
    const hit = hitLine !== -1

    const newCounter = lruCounter + 1
    if (hit) {
      set[hitLine].lru = newCounter
    } else {
      const emptyIdx = set.findIndex(l => !l.valid)
      if (emptyIdx !== -1) {
        set[emptyIdx] = { valid: true, tag: tagVal, lru: newCounter }
      } else {
        const lruIdx = set.reduce((minI, l, i, arr) => l.lru < arr[minI].lru ? i : minI, 0)
        set[lruIdx] = { valid: true, tag: tagVal, lru: newCounter }
      }
    }

    if (setIdx < S) newCache[setIdx % S] = set
    setCacheState(newCache)
    setLruCounter(newCounter)

    setAccessLog(prev => [...prev, {
      addr: addrHex,
      bin: binStr,
      tag: tagBin,
      index: indexBin,
      offset: offsetBin,
      set: setIdx % S,
      tagVal,
      hit,
    }])
  }, [addrInput, m, b, s, t, S, E, cacheState, lruCounter])

  const resetSim = () => {
    setCacheState(Array.from({ length: S }, () => Array.from({ length: E }, () => ({ valid: false, tag: null, lru: 0 }))))
    setAccessLog([])
    setLruCounter(0)
  }

  // Walkthrough
  const walkthroughSteps = buildWalkthroughSteps()
  const [wAccess, setWAccess] = useState(0)
  const [wStep, setWStep] = useState(0)

  const currentSteps = walkthroughSteps[wAccess] || []
  const currentStep = currentSteps[wStep]

  const advanceWalkthrough = () => {
    if (wStep < currentSteps.length - 1) {
      setWStep(s => s + 1)
    } else if (wAccess < walkthroughSteps.length - 1) {
      setWAccess(a => a + 1)
      setWStep(0)
    }
  }

  // Problems
  const [problemStats, setProblemStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cache_accuracy') || '{"correct":0,"total":0}') } catch { return { correct: 0, total: 0 } }
  })
  const [activeProblems, setActiveProblems] = useState(() => shuffleAndPick(cacheProblems, 6))

  const reshuffleProblems = useCallback(() => {
    setActiveProblems(shuffleAndPick(cacheProblems, 6))
  }, [])

  const handleAnswer = (correct) => {
    const updated = { correct: problemStats.correct + (correct ? 1 : 0), total: problemStats.total + 1 }
    setProblemStats(updated)
    localStorage.setItem('cache_accuracy', JSON.stringify(updated))
  }

  const paramInput = (label, val, setter, min = 1) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ color: '#94a3b8', fontSize: '12px' }}>{label}</label>
      <input type="number" value={val} min={min}
        onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= min) setter(v) }}
        style={{ width: '72px', padding: '6px 8px', backgroundColor: '#0f1117', border: '1px solid #374151', borderRadius: '6px', color: '#e2e8f0', fontSize: '14px', outline: 'none', textAlign: 'center' }}
      />
    </div>
  )

  return (
    <div style={{ padding: '28px 32px', maxWidth: '960px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>⚡ Cache Performance</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Parameter calculator · Address decomposition · Step-through · Practice problems</p>
      </div>

      {/* Section 1: Parameter Calculator */}
      <div style={{ marginBottom: '36px' }}>
        <SectionHeader>Section 1 — Cache Parameter Calculator</SectionHeader>
        <div style={{ backgroundColor: '#1a1d27', border: '1px solid #2d3148', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'flex-end' }}>
            {paramInput('S (sets)', S, setS, 1)}
            {paramInput('E (lines)', E, setE, 1)}
            {paramInput('B (bytes)', B, setB, 1)}
            {paramInput('m (addr bits)', m, setM, 1)}
            <button onClick={resetSim} style={{ padding: '6px 14px', backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '6px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', alignSelf: 'flex-end' }}>
              Reset Sim
            </button>
          </div>

          {/* Computed values */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {[
              { label: 'Offset bits (b)', val: b, color: '#22c55e' },
              { label: 'Index bits (s)', val: s, color: '#eab308' },
              { label: 'Tag bits (t)', val: t > 0 ? t : '!', color: '#3b82f6' },
              { label: 'Cache size', val: `${S * E * B}B`, color: '#a78bfa' },
              { label: 'Valid bits', val: S * E, color: '#14b8a6' },
            ].map(item => (
              <div key={item.label} style={{ backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '6px', padding: '10px 14px', minWidth: '120px' }}>
                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ color: item.color, fontSize: '20px', fontWeight: 700, fontFamily: 'monospace' }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Cache grid */}
          <div>
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>Cache Structure (showing current state)</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace', minWidth: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ color: '#475569', padding: '4px 8px', textAlign: 'left', borderBottom: '1px solid #374151' }}>Set</th>
                    {Array.from({ length: E }, (_, i) => (
                      <th key={i} colSpan={3} style={{ color: '#14b8a6', padding: '4px 8px', textAlign: 'center', borderBottom: '1px solid #374151', borderLeft: '1px solid #374151' }}>
                        Line {i}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th style={{ color: '#475569', padding: '3px 8px', fontSize: '10px' }}></th>
                    {Array.from({ length: E }, (_, i) => (
                      <>
                        <th key={`v${i}`} style={{ color: '#64748b', padding: '3px 6px', fontSize: '10px', borderLeft: '1px solid #2d3148' }}>V</th>
                        <th key={`t${i}`} style={{ color: '#3b82f6', padding: '3px 6px', fontSize: '10px' }}>Tag</th>
                        <th key={`d${i}`} style={{ color: '#22c55e', padding: '3px 6px', fontSize: '10px' }}>Data</th>
                      </>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.min(S, 8) }, (_, si) => {
                    const setLines = (cacheState[si] || []).slice(0, E)
                    while (setLines.length < E) setLines.push({ valid: false, tag: null })
                    return (
                      <tr key={si} style={{ borderBottom: '1px solid #22263a' }}>
                        <td style={{ color: '#64748b', padding: '4px 8px', fontWeight: 600 }}>S{si}</td>
                        {setLines.map((line, li) => (
                          <>
                            <td key={`v${li}`} style={{ padding: '4px 6px', textAlign: 'center', borderLeft: '1px solid #2d3148', color: line.valid ? '#22c55e' : '#475569' }}>{line.valid ? '1' : '0'}</td>
                            <td key={`t${li}`} style={{ padding: '4px 6px', textAlign: 'center', color: '#93c5fd' }}>{line.valid ? line.tag.toString(2).padStart(t, '0') : '—'}</td>
                            <td key={`d${li}`} style={{ padding: '4px 6px', textAlign: 'center', color: '#6ee7b7' }}>{line.valid ? `[${B}B]` : '—'}</td>
                          </>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Address Decomposition */}
      <div style={{ marginBottom: '36px' }}>
        <SectionHeader>Section 2 — Address Decomposition Simulator</SectionHeader>
        <div style={{ backgroundColor: '#1a1d27', border: '1px solid #2d3148', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Hex Address</div>
              <input value={addrInput} onChange={e => setAddrInput(e.target.value)}
                placeholder="0x1A3F"
                style={{ padding: '8px 12px', backgroundColor: '#0f1117', border: '1px solid #374151', borderRadius: '6px', color: '#e2e8f0', fontSize: '14px', fontFamily: 'monospace', outline: 'none', width: '120px' }}
              />
            </div>
            <button onClick={simulateAccess}
              style={{ padding: '8px 16px', backgroundColor: '#14b8a6', border: '1px solid #14b8a6', borderRadius: '6px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
              Access
            </button>
            <button onClick={() => { setAccessLog([]); setCacheState(Array.from({ length: S }, () => Array.from({ length: E }, () => ({ valid: false, tag: null, lru: 0 })))) }}
              style={{ padding: '8px 14px', backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '6px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
              Clear Log
            </button>
          </div>

          {/* Live decomposition preview */}
          {addrInput && (() => {
            try {
              const addr = parseInt(addrInput, 16)
              if (isNaN(addr)) return null
              const bin = addr.toString(2).padStart(m, '0')
              const { tag, index, offset } = decompose(bin, b, s, t)
              return (
                <div style={{ marginBottom: '16px', backgroundColor: '#0f1117', border: '1px solid #374151', borderRadius: '6px', padding: '14px' }}>
                  <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>Binary decomposition ({m} bits):</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '16px', letterSpacing: '1px', display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
                    {t > 0 && <span style={{ color: '#93c5fd', backgroundColor: 'rgba(59,130,246,0.15)', padding: '2px 4px', borderRadius: '3px' }} title="Tag">{tag}</span>}
                    {s > 0 && <span style={{ color: '#fde047', backgroundColor: 'rgba(234,179,8,0.15)', padding: '2px 4px', borderRadius: '3px' }} title="Index">{index}</span>}
                    <span style={{ color: '#86efac', backgroundColor: 'rgba(34,197,94,0.15)', padding: '2px 4px', borderRadius: '3px' }} title="Offset">{offset}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#93c5fd', fontSize: '12px' }}>Tag = {parseInt(tag, 2) || 0} (t={t}b)</span>
                    <span style={{ color: '#fde047', fontSize: '12px' }}>Set = {parseInt(index, 2) || 0} (s={s}b)</span>
                    <span style={{ color: '#86efac', fontSize: '12px' }}>Offset = {parseInt(offset, 2) || 0} (b={b}b)</span>
                  </div>
                </div>
              )
            } catch { return null }
          })()}

          {/* Access log table */}
          {accessLog.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #374151' }}>
                    {['#', 'Address', 'Binary', 'Tag', 'Index', 'Offset', 'Set', 'Result'].map(h => (
                      <th key={h} style={{ color: '#64748b', padding: '6px 8px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accessLog.map((entry, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1a1d27' }}>
                      <td style={{ padding: '6px 8px', color: '#475569' }}>{i + 1}</td>
                      <td style={{ padding: '6px 8px', color: '#e2e8f0' }}>{entry.addr}</td>
                      <td style={{ padding: '6px 8px', color: '#94a3b8', fontSize: '11px' }}>{entry.bin}</td>
                      <td style={{ padding: '6px 8px', color: '#93c5fd' }}>{entry.tag}</td>
                      <td style={{ padding: '6px 8px', color: '#fde047' }}>{entry.index}</td>
                      <td style={{ padding: '6px 8px', color: '#86efac' }}>{entry.offset}</td>
                      <td style={{ padding: '6px 8px', color: '#e2e8f0' }}>{entry.set}</td>
                      <td style={{ padding: '6px 8px', fontWeight: 600, color: entry.hit ? '#22c55e' : '#ef4444' }}>
                        {entry.hit ? 'HIT' : 'MISS'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Step-by-Step Walkthrough */}
      <div style={{ marginBottom: '36px' }}>
        <SectionHeader>Section 3 — Step-by-Step Walkthrough (S=4, E=1, B=4, m=8)</SectionHeader>
        <div style={{ backgroundColor: '#1a1d27', border: '1px solid #2d3148', borderRadius: '8px', padding: '20px' }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {WALKTHROUGH_ACCESSES.map((addr, i) => (
              <div key={i}
                onClick={() => { setWAccess(i); setWStep(0) }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: i === wAccess ? 'rgba(59,130,246,0.2)' : '#22263a',
                  border: `1px solid ${i === wAccess ? '#3b82f6' : '#374151'}`,
                  borderRadius: '6px',
                  color: i === wAccess ? '#93c5fd' : '#64748b',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}>
                0x{addr.toString(16).toUpperCase().padStart(2, '0')}
              </div>
            ))}
          </div>

          <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '12px' }}>
            Access {wAccess + 1} of {WALKTHROUGH_ACCESSES.length} — Step {wStep + 1} of {currentSteps.length}
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {currentSteps.map((step, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                backgroundColor: i === wStep ? '#22263a' : '#0f1117',
                border: `1px solid ${i === wStep ? '#3b82f6' : '#2d3148'}`,
                borderRadius: '6px',
                opacity: i > wStep ? 0.3 : 1,
              }}>
                <div style={{ color: i === wStep ? '#93c5fd' : '#64748b', fontSize: '13px', fontWeight: 600, marginBottom: i === wStep ? '6px' : 0 }}>
                  {step.label}
                </div>
                {i <= wStep && (
                  <div style={{ color: '#94a3b8', fontSize: '13px', fontFamily: 'monospace' }}>
                    {step.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={advanceWalkthrough}
              disabled={wAccess === walkthroughSteps.length - 1 && wStep === currentSteps.length - 1}
              style={{ padding: '8px 16px', backgroundColor: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '6px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
              Next Step →
            </button>
            <button onClick={() => { setWAccess(0); setWStep(0) }}
              style={{ padding: '8px 14px', backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '6px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Practice Problems */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #2d3148' }}>
          <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Section 4 — Practice Problems
            {problemStats.total > 0 && (
              <span style={{ marginLeft: '12px', color: '#e2e8f0', textTransform: 'none', letterSpacing: 0 }}>
                {problemStats.correct}/{problemStats.total} correct ({Math.round((problemStats.correct / problemStats.total) * 100)}%)
              </span>
            )}
          </div>
          <button
            onClick={reshuffleProblems}
            style={{ padding: '5px 12px', backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '6px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}
          >
            New Set ({cacheProblems.length} pool)
          </button>
        </div>
        {activeProblems.map(p => <ProblemCard key={p.id} problem={p} onAnswer={handleAnswer} />)}
      </div>
    </div>
  )
}
