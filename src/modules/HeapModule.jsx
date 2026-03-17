import { useState, useEffect, useCallback } from 'react'
import { heapProblems } from '../data/heapProblems'

function shuffleAndPick(arr, n) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

const INITIAL_HEAP = [
  { id: 1, size: 16, allocated: true, payload: 'A' },
  { id: 2, size: 24, allocated: false },
  { id: 3, size: 32, allocated: true, payload: 'B' },
  { id: 4, size: 16, allocated: false },
  { id: 5, size: 48, allocated: true, payload: 'C' },
]

const CONCEPTS = [
  {
    title: 'Block Header Format',
    content: `Each heap block has a header stored in the first 4 or 8 bytes. It encodes the block size and an allocated bit in the LSB. Size is always a multiple of alignment (e.g. 8 bytes), so the lower 3 bits are always 0 — we steal the LSB to store allocation status.

Example: header value 0x11 = size 16, allocated=1.
  • To get size: header & ~0x7
  • To get allocated bit: header & 0x1
  • Header 0x29 = 41 decimal → size = 40, allocated = 1`,
  },
  {
    title: 'Coalescing Rules',
    content: `When you free a block, the allocator checks adjacent blocks. If the previous block is free AND/OR the next block is free, they merge into one larger free block.

This requires a footer (boundary tag) at the end of each block to allow backwards traversal. Coalescing reduces external fragmentation.

  • Immediate coalescing: done on every free() call
  • Deferred coalescing: batched for performance
  • Four cases: neither adjacent free, prev free only, next free only, both free`,
  },
  {
    title: 'Why Headers Exist',
    content: `malloc() returns a pointer to the payload (after the header). free() receives only that pointer. To know the block size for freeing, the allocator reads the header at ptr − HEADER_SIZE.

Without headers, free() couldn't know how many bytes to mark as available. The header is typically 4 or 8 bytes, stored just before the payload pointer returned to the user.`,
  },
  {
    title: 'Internal vs External Fragmentation',
    content: `Internal fragmentation: wasted space INSIDE an allocated block.
Example: malloc(13) in an allocator with 8-byte alignment allocates a 16-byte block — 3 bytes wasted inside.

External fragmentation: enough total free memory exists but no single contiguous block is large enough.
Example: two 16-byte free blocks but malloc(32) fails because they aren't adjacent.

Coalescing addresses external fragmentation. Alignment policy affects internal fragmentation.`,
  },
  {
    title: 'Placement Policies',
    content: `First fit: scan from start, use first block that fits. Simple and fast for small heaps. Can cause clustering near the front.

Next fit: continue scanning from where last search ended. Faster than first-fit but tends to produce more fragmentation.

Best fit: find smallest block that fits. Minimizes internal fragmentation but requires full scan (slow). Leaves smaller, potentially unusable fragments.

CS354 typically tests first-fit. Know the trade-offs for each.`,
  },
]

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: '#22263a',
      border: '1px solid #3b82f6',
      color: '#e2e8f0',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      zIndex: 100,
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    }}>
      {message}
    </div>
  )
}

function HeapBlock({ block, onFree }) {
  const minWidth = Math.max(80, block.size * 1.8)
  const bg = block.allocated ? '#1d4ed8' : '#374151'
  const textColor = block.allocated ? '#fff' : '#9ca3af'
  const border = block.allocated ? '1px solid #3b82f6' : '1px solid #4b5563'

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: `${minWidth}px`,
      height: '80px',
      backgroundColor: bg,
      border,
      borderRadius: '6px',
      padding: '6px 8px',
      position: 'relative',
      flexShrink: 0,
    }}>
      <div style={{ color: textColor, fontSize: '11px', fontFamily: 'monospace', opacity: 0.8 }}>
        {block.size}/{block.allocated ? 1 : 0}
      </div>
      <div style={{ color: textColor, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
        {block.payload || '(free)'}
      </div>
      <div style={{ color: textColor, fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>
        {block.size}B
      </div>
      {block.allocated && (
        <button
          onClick={() => onFree(block.id)}
          style={{
            position: 'absolute',
            top: '3px',
            right: '3px',
            backgroundColor: 'rgba(239,68,68,0.3)',
            border: '1px solid rgba(239,68,68,0.5)',
            color: '#fca5a5',
            fontSize: '9px',
            borderRadius: '3px',
            padding: '1px 4px',
            cursor: 'pointer',
          }}
        >
          free
        </button>
      )}
    </div>
  )
}

function ConceptCard({ title, content }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      backgroundColor: '#1a1d27',
      border: '1px solid #2d3148',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '8px',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          color: '#e2e8f0',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span>{title}</span>
        <span style={{ color: '#64748b', fontSize: '16px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
      </button>
      {open && (
        <div style={{
          padding: '0 16px 16px',
          color: '#94a3b8',
          fontSize: '13px',
          lineHeight: '1.7',
          borderTop: '1px solid #2d3148',
          paddingTop: '14px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit',
        }}>
          {content}
        </div>
      )}
    </div>
  )
}

function ProblemCard({ problem, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (idx) => {
    if (revealed) return
    setSelected(idx)
  }

  const handleCheck = () => {
    if (selected === null) return
    setRevealed(true)
    onAnswer(selected === problem.answer)
  }

  const optionLetters = ['A', 'B', 'C', 'D']

  return (
    <div style={{
      backgroundColor: '#1a1d27',
      border: '1px solid #2d3148',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '12px',
    }}>
      {problem.heapState && (
        <div style={{
          backgroundColor: '#0f1117',
          border: '1px solid #374151',
          borderRadius: '6px',
          padding: '8px 12px',
          marginBottom: '12px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#14b8a6',
        }}>
          Heap: {problem.heapState}
        </div>
      )}
      <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500, marginBottom: '14px', lineHeight: '1.5' }}>
        {problem.id}. {problem.question}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {problem.options.map((opt, idx) => {
          let bg = '#22263a'
          let border = '1px solid #374151'
          let color = '#94a3b8'
          if (selected === idx && !revealed) { bg = 'rgba(59,130,246,0.15)'; border = '1px solid #3b82f6'; color = '#93c5fd' }
          if (revealed && idx === problem.answer) { bg = 'rgba(34,197,94,0.15)'; border = '1px solid #22c55e'; color = '#86efac' }
          if (revealed && selected === idx && idx !== problem.answer) { bg = 'rgba(239,68,68,0.15)'; border = '1px solid #ef4444'; color = '#fca5a5' }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 14px', backgroundColor: bg, border, borderRadius: '6px',
                color, fontSize: '13px', cursor: revealed ? 'default' : 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontWeight: 600, minWidth: '18px' }}>{optionLetters[idx]})</span>
              <span>{opt}</span>
              {revealed && idx === problem.answer && <span style={{ marginLeft: 'auto' }}>✓</span>}
              {revealed && selected === idx && idx !== problem.answer && <span style={{ marginLeft: 'auto' }}>✗</span>}
            </button>
          )
        })}
      </div>
      {!revealed && (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          style={{
            padding: '8px 16px',
            backgroundColor: selected !== null ? '#3b82f6' : '#22263a',
            border: '1px solid ' + (selected !== null ? '#3b82f6' : '#374151'),
            borderRadius: '6px',
            color: selected !== null ? '#fff' : '#475569',
            fontSize: '13px',
            cursor: selected !== null ? 'pointer' : 'not-allowed',
          }}
        >
          Check Answer
        </button>
      )}
      {revealed && (
        <div style={{
          backgroundColor: '#0f1117',
          border: '1px solid #374151',
          borderRadius: '6px',
          padding: '12px',
          color: '#94a3b8',
          fontSize: '13px',
          lineHeight: '1.6',
        }}>
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>Explanation: </span>
          {problem.explanation}
        </div>
      )}
    </div>
  )
}

function SectionHeader({ children }) {
  return (
    <div style={{
      color: '#64748b',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '14px',
      paddingBottom: '8px',
      borderBottom: '1px solid #2d3148',
    }}>
      {children}
    </div>
  )
}

export default function HeapModule() {
  const [heap, setHeap] = useState(INITIAL_HEAP.map(b => ({ ...b })))
  const [mallocSize, setMallocSize] = useState('')
  const [toast, setToast] = useState(null)
  const [nextId, setNextId] = useState(6)
  const [problemStats, setProblemStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('heap_accuracy') || '{"correct":0,"total":0}') } catch { return { correct: 0, total: 0 } }
  })
  const [activeProblems, setActiveProblems] = useState(() => shuffleAndPick(heapProblems, 6))

  const reshuffleProblems = useCallback(() => {
    setActiveProblems(shuffleAndPick(heapProblems, 6))
  }, [])

  const showToast = (msg) => setToast(msg)

  const handleMalloc = () => {
    const size = parseInt(mallocSize)
    if (!size || size <= 0) return
    const aligned = Math.ceil(size / 8) * 8
    const needed = Math.max(16, aligned)

    const idx = heap.findIndex(b => !b.allocated && b.size >= needed)
    if (idx === -1) {
      showToast(`No free block large enough for ${size} bytes`)
      return
    }
    const block = heap[idx]
    const newHeap = [...heap]
    if (block.size - needed >= 16) {
      const newBlock = { id: nextId, size: block.size - needed, allocated: false }
      newHeap.splice(idx, 1,
        { ...block, size: needed, allocated: true, payload: `m${nextId}` },
        newBlock,
      )
      setNextId(n => n + 1)
    } else {
      newHeap[idx] = { ...block, allocated: true, payload: `m${nextId}` }
      setNextId(n => n + 1)
    }
    setHeap(newHeap)
    showToast(`Allocated ${size} bytes at block ${block.id}`)
    setMallocSize('')
  }

  const handleFree = (id) => {
    let newHeap = heap.map(b => b.id === id ? { ...b, allocated: false, payload: undefined } : { ...b })
    const idx = newHeap.findIndex(b => b.id === id)
    let coalesceMsg = ''

    // Coalesce next
    if (idx < newHeap.length - 1 && !newHeap[idx + 1].allocated) {
      const merged = { ...newHeap[idx], size: newHeap[idx].size + newHeap[idx + 1].size }
      coalesceMsg += ` Coalesced with block ${newHeap[idx + 1].id}.`
      newHeap.splice(idx, 2, merged)
    }
    // Coalesce prev
    if (idx > 0 && !newHeap[idx - 1].allocated) {
      const merged = { ...newHeap[idx - 1], size: newHeap[idx - 1].size + newHeap[idx].size }
      coalesceMsg += ` Coalesced with block ${newHeap[idx - 1].id}.`
      newHeap.splice(idx - 1, 2, merged)
    }

    setHeap(newHeap)
    showToast(`Freed block ${id}.${coalesceMsg}`)
  }

  const handleAnswer = (correct) => {
    const updated = {
      correct: problemStats.correct + (correct ? 1 : 0),
      total: problemStats.total + 1,
    }
    setProblemStats(updated)
    localStorage.setItem('heap_accuracy', JSON.stringify(updated))
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '960px' }}>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
          📦 Heap Memory
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
          Interactive allocator · Concept review · Practice problems
        </p>
      </div>

      {/* Section 1: Heap Visualizer */}
      <div style={{ marginBottom: '36px' }}>
        <SectionHeader>Section 1 — Interactive Heap Visualizer</SectionHeader>

        {/* Heap Display */}
        <div style={{
          backgroundColor: '#1a1d27',
          border: '1px solid #2d3148',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '16px',
          overflowX: 'auto',
        }}>
          <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Heap Layout (address → )
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'stretch', minWidth: 'max-content' }}>
            {heap.map(block => (
              <HeapBlock key={block.id} block={block} onFree={handleFree} />
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#1d4ed8', borderRadius: '3px' }} />
              <span style={{ color: '#64748b', fontSize: '12px' }}>Allocated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#374151', borderRadius: '3px' }} />
              <span style={{ color: '#64748b', fontSize: '12px' }}>Free</span>
            </div>
            <div style={{ marginLeft: 'auto', color: '#475569', fontSize: '12px', fontFamily: 'monospace' }}>
              Total: {heap.reduce((s, b) => s + b.size, 0)}B | Free: {heap.filter(b => !b.allocated).reduce((s, b) => s + b.size, 0)}B
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            <input
              type="number"
              value={mallocSize}
              onChange={e => setMallocSize(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleMalloc()}
              placeholder="bytes"
              min="1"
              style={{
                width: '100px',
                padding: '8px 10px',
                backgroundColor: '#22263a',
                border: '1px solid #374151',
                borderRight: 'none',
                borderRadius: '6px 0 0 6px',
                color: '#e2e8f0',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleMalloc}
              style={{
                padding: '8px 14px',
                backgroundColor: '#3b82f6',
                border: '1px solid #3b82f6',
                borderRadius: '0 6px 6px 0',
                color: '#fff',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              malloc(n)
            </button>
          </div>
          <button
            onClick={() => { setHeap(INITIAL_HEAP.map(b => ({ ...b }))); setNextId(6) }}
            style={{
              padding: '8px 14px',
              backgroundColor: '#22263a',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Reset Heap
          </button>
          <div style={{ color: '#475569', fontSize: '12px' }}>
            Click "free" button on any blue block to free it. Coalescing is automatic.
          </div>
        </div>
      </div>

      {/* Section 2: Concept Review */}
      <div style={{ marginBottom: '36px' }}>
        <SectionHeader>Section 2 — Concept Review</SectionHeader>
        {CONCEPTS.map((c, i) => <ConceptCard key={i} title={c.title} content={c.content} />)}
      </div>

      {/* Section 3: Practice Problems */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #2d3148' }}>
          <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Section 3 — Practice Problems
            {problemStats.total > 0 && (
              <span style={{ marginLeft: '12px', color: '#e2e8f0', textTransform: 'none', letterSpacing: 0 }}>
                {problemStats.correct}/{problemStats.total} correct
                ({Math.round((problemStats.correct / problemStats.total) * 100)}%)
              </span>
            )}
          </div>
          <button
            onClick={reshuffleProblems}
            style={{ padding: '5px 12px', backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '6px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}
          >
            New Set ({heapProblems.length} pool)
          </button>
        </div>
        {activeProblems.map(p => <ProblemCard key={p.id} problem={p} onAnswer={handleAnswer} />)}
      </div>
    </div>
  )
}
