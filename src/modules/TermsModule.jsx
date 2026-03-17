import { useState, useMemo, useCallback } from 'react'
import { termSections, allTerms } from '../data/termDefinitions'

// ── Utilities ────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionPill({ section, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: '20px',
        border: `1px solid ${active ? section.color : '#2d3148'}`,
        backgroundColor: active ? `${section.color}22` : 'transparent',
        color: active ? section.color : '#64748b',
        fontSize: '12px',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s',
      }}
    >
      {section.label} ({section.terms.length})
    </button>
  )
}

// ── BROWSE MODE ───────────────────────────────────────────────────────────────

function BrowseMode({ activeSectionIds }) {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return allTerms.filter(t => {
      const inSection = activeSectionIds.length === 0 || activeSectionIds.includes(t.sectionId)
      const matchesSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      return inSection && matchesSearch
    })
  }, [activeSectionIds, search])

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search terms or definitions..."
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '9px 14px', backgroundColor: '#1a1d27',
          border: '1px solid #374151', borderRadius: '8px',
          color: '#e2e8f0', fontSize: '13px', marginBottom: '16px',
          outline: 'none',
        }}
      />
      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '12px' }}>
        {filtered.length} term{filtered.length !== 1 ? 's' : ''}
      </div>
      {filtered.map(term => {
        const open = expandedId === term.id
        const section = termSections.find(s => s.id === term.sectionId)
        return (
          <div
            key={term.id}
            style={{
              backgroundColor: '#1a1d27',
              border: `1px solid ${open ? section.color + '55' : '#2d3148'}`,
              borderRadius: '8px',
              marginBottom: '6px',
              overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}
          >
            <button
              onClick={() => setExpandedId(open ? null : term.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '10px', padding: '12px 16px',
                background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{
                fontSize: '10px', fontWeight: 700, padding: '2px 7px',
                borderRadius: '4px', backgroundColor: section.color + '22',
                color: section.color, whiteSpace: 'nowrap',
              }}>
                {section.label}
              </span>
              <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600, flex: 1 }}>
                {term.term}
              </span>
              <span style={{ color: '#475569', fontSize: '14px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
            </button>
            {open && (
              <div style={{
                padding: '0 16px 14px 16px',
                color: '#94a3b8', fontSize: '13px', lineHeight: '1.7',
                borderTop: '1px solid #2d3148',
                paddingTop: '12px',
              }}>
                {term.definition}
              </div>
            )}
          </div>
        )
      })}
      {filtered.length === 0 && (
        <div style={{ color: '#475569', fontSize: '13px', textAlign: 'center', padding: '32px' }}>
          No terms match your search.
        </div>
      )}
    </div>
  )
}

// ── FLASHCARD MODE ────────────────────────────────────────────────────────────

function FlashcardMode({ activeSectionIds }) {
  const deck = useMemo(() => {
    const base = activeSectionIds.length === 0
      ? allTerms
      : allTerms.filter(t => activeSectionIds.includes(t.sectionId))
    return shuffle(base)
  }, [activeSectionIds])

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(new Set())
  const [unknown, setUnknown] = useState(new Set())

  const card = deck[index]
  const section = card ? termSections.find(s => s.id === card.sectionId) : null

  const goNext = useCallback(() => {
    setFlipped(false)
    setIndex(i => Math.min(i + 1, deck.length - 1))
  }, [deck.length])

  const goPrev = useCallback(() => {
    setFlipped(false)
    setIndex(i => Math.max(i - 1, 0))
  }, [])

  const markKnown = useCallback(() => {
    setKnown(prev => new Set([...prev, card.id]))
    setUnknown(prev => { const n = new Set(prev); n.delete(card.id); return n })
    goNext()
  }, [card, goNext])

  const markUnknown = useCallback(() => {
    setUnknown(prev => new Set([...prev, card.id]))
    setKnown(prev => { const n = new Set(prev); n.delete(card.id); return n })
    goNext()
  }, [card, goNext])

  if (!card) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: '#475569', fontSize: '14px' }}>
        No terms in selected sections.
      </div>
    )
  }

  const isKnown = known.has(card.id)
  const isUnknown = unknown.has(card.id)

  return (
    <div>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ color: '#475569', fontSize: '12px' }}>{index + 1} / {deck.length}</span>
        <div style={{ flex: 1, height: '4px', backgroundColor: '#22263a', borderRadius: '2px' }}>
          <div style={{ width: `${((index + 1) / deck.length) * 100}%`, height: '100%', backgroundColor: section.color, borderRadius: '2px', transition: 'width 0.3s' }} />
        </div>
        <span style={{ color: '#22c55e', fontSize: '12px' }}>✓ {known.size}</span>
        <span style={{ color: '#ef4444', fontSize: '12px' }}>✗ {unknown.size}</span>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          minHeight: '220px', backgroundColor: '#1a1d27',
          border: `2px solid ${flipped ? section.color + '88' : '#2d3148'}`,
          borderRadius: '12px', padding: '32px',
          cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          transition: 'border-color 0.2s', marginBottom: '16px', position: 'relative',
          userSelect: 'none',
        }}
      >
        <div style={{
          position: 'absolute', top: '12px', left: '16px',
          fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
          backgroundColor: section.color + '22', color: section.color,
        }}>
          {section.label}
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '16px', color: '#475569', fontSize: '11px' }}>
          {flipped ? 'Definition' : 'Term'} · click to flip
        </div>

        {!flipped ? (
          <div style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 700, lineHeight: 1.4 }}>
            {card.term}
          </div>
        ) : (
          <div style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.7', maxWidth: '600px' }}>
            {card.definition}
          </div>
        )}

        {(isKnown || isUnknown) && (
          <div style={{
            position: 'absolute', bottom: '12px', right: '16px',
            fontSize: '11px', color: isKnown ? '#22c55e' : '#ef4444',
          }}>
            {isKnown ? '✓ Know it' : '✗ Review'}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={goPrev} disabled={index === 0}
          style={{ padding: '9px 18px', backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '6px', color: index === 0 ? '#374151' : '#94a3b8', fontSize: '13px', cursor: index === 0 ? 'not-allowed' : 'pointer' }}>
          ← Prev
        </button>
        <button onClick={markUnknown}
          style={{ padding: '9px 18px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef444466', borderRadius: '6px', color: '#fca5a5', fontSize: '13px', cursor: 'pointer' }}>
          ✗ Still Learning
        </button>
        <button onClick={markKnown}
          style={{ padding: '9px 18px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e66', borderRadius: '6px', color: '#86efac', fontSize: '13px', cursor: 'pointer' }}>
          ✓ Know It
        </button>
        <button onClick={goNext} disabled={index === deck.length - 1}
          style={{ padding: '9px 18px', backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '6px', color: index === deck.length - 1 ? '#374151' : '#94a3b8', fontSize: '13px', cursor: index === deck.length - 1 ? 'not-allowed' : 'pointer' }}>
          Next →
        </button>
      </div>

      {known.size + unknown.size === deck.length && deck.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'center', padding: '16px', backgroundColor: '#1a1d27', borderRadius: '8px', border: '1px solid #2d3148' }}>
          <div style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '4px' }}>
            Deck complete! {known.size}/{deck.length} known ({Math.round((known.size / deck.length) * 100)}%)
          </div>
          <button
            onClick={() => { setIndex(0); setFlipped(false); setKnown(new Set()); setUnknown(new Set()) }}
            style={{ marginTop: '8px', padding: '7px 16px', backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '6px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}
          >
            Restart Deck
          </button>
        </div>
      )}
    </div>
  )
}

// ── QUIZ MODE ─────────────────────────────────────────────────────────────────

function QuizMode({ activeSectionIds }) {
  const [quizTerms, setQuizTerms] = useState(null)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [done, setDone] = useState(false)

  const pool = useMemo(() => {
    const base = activeSectionIds.length === 0
      ? allTerms
      : allTerms.filter(t => activeSectionIds.includes(t.sectionId))
    return base
  }, [activeSectionIds])

  const startQuiz = useCallback((n) => {
    if (pool.length < 4) return
    const picked = shuffle(pool).slice(0, Math.min(n, pool.length))
    setQuizTerms(picked)
    setQIndex(0)
    setSelected(null)
    setRevealed(false)
    setScore({ correct: 0, total: 0 })
    setDone(false)
  }, [pool])

  // Build question with 4 choices
  const question = useMemo(() => {
    if (!quizTerms || qIndex >= quizTerms.length) return null
    const target = quizTerms[qIndex]
    const distractors = shuffle(allTerms.filter(t => t.id !== target.id)).slice(0, 3)
    const options = shuffle([target, ...distractors])
    const answerIdx = options.findIndex(o => o.id === target.id)
    return { target, options, answerIdx }
  }, [quizTerms, qIndex])

  if (!quizTerms) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
          {pool.length} terms available in selected sections.
          {pool.length < 4 && (
            <span style={{ color: '#ef4444' }}> Select at least one section with 4+ terms.</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[10, 20, 30].map(n => (
            <button
              key={n}
              onClick={() => startQuiz(n)}
              disabled={pool.length < 4}
              style={{
                padding: '12px 28px', borderRadius: '8px', fontSize: '14px', cursor: pool.length < 4 ? 'not-allowed' : 'pointer',
                backgroundColor: pool.length < 4 ? '#22263a' : 'rgba(249,115,22,0.15)',
                border: `1px solid ${pool.length < 4 ? '#374151' : '#f97316'}`,
                color: pool.length < 4 ? '#374151' : '#fdba74',
                fontWeight: 600,
              }}
            >
              {n} Questions
            </button>
          ))}
          <button
            onClick={() => startQuiz(pool.length)}
            disabled={pool.length < 4}
            style={{
              padding: '12px 28px', borderRadius: '8px', fontSize: '14px', cursor: pool.length < 4 ? 'not-allowed' : 'pointer',
              backgroundColor: pool.length < 4 ? '#22263a' : 'rgba(249,115,22,0.2)',
              border: `1px solid ${pool.length < 4 ? '#374151' : '#f97316'}`,
              color: pool.length < 4 ? '#374151' : '#fdba74',
              fontWeight: 700,
            }}
          >
            All ({pool.length})
          </button>
        </div>
      </div>
    )
  }

  if (done || qIndex >= quizTerms.length) {
    const pct = Math.round((score.correct / score.total) * 100)
    const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F'
    const gradeColor = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444'
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '48px', fontWeight: 800, color: gradeColor, marginBottom: '8px' }}>{grade}</div>
        <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
          {score.correct} / {score.total} correct ({pct}%)
        </div>
        <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
          Terms quiz complete
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => startQuiz(quizTerms.length)}
            style={{ padding: '9px 20px', backgroundColor: 'rgba(249,115,22,0.15)', border: '1px solid #f97316', borderRadius: '8px', color: '#fdba74', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
            Retry Same Set
          </button>
          <button onClick={() => setQuizTerms(null)}
            style={{ padding: '9px 20px', backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
            New Quiz
          </button>
        </div>
      </div>
    )
  }

  if (!question) return null

  const letters = ['A', 'B', 'C', 'D']

  const handleCheck = () => {
    if (selected === null) return
    setRevealed(true)
    setScore(s => ({ correct: s.correct + (selected === question.answerIdx ? 1 : 0), total: s.total + 1 }))
  }

  const handleNext = () => {
    if (qIndex + 1 >= quizTerms.length) {
      setDone(true)
    } else {
      setQIndex(i => i + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  return (
    <div>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ color: '#475569', fontSize: '12px' }}>{qIndex + 1} / {quizTerms.length}</span>
        <div style={{ flex: 1, height: '4px', backgroundColor: '#22263a', borderRadius: '2px' }}>
          <div style={{ width: `${((qIndex + 1) / quizTerms.length) * 100}%`, height: '100%', backgroundColor: '#f97316', borderRadius: '2px', transition: 'width 0.3s' }} />
        </div>
        <span style={{ color: '#22c55e', fontSize: '12px' }}>✓ {score.correct}</span>
        <span style={{ color: '#ef4444', fontSize: '12px' }}>✗ {score.total - score.correct}</span>
      </div>

      {/* Question */}
      <div style={{ backgroundColor: '#1a1d27', border: '1px solid #2d3148', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          What is the definition of:
        </div>
        <div style={{ color: '#e2e8f0', fontSize: '16px', fontWeight: 700, lineHeight: 1.4 }}>
          {question.target.term}
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {question.options.map((opt, idx) => {
          let bg = '#22263a', border = '1px solid #374151', color = '#94a3b8'
          if (selected === idx && !revealed) { bg = 'rgba(249,115,22,0.12)'; border = '1px solid #f97316'; color = '#fdba74' }
          if (revealed && idx === question.answerIdx) { bg = 'rgba(34,197,94,0.12)'; border = '1px solid #22c55e'; color = '#86efac' }
          if (revealed && selected === idx && idx !== question.answerIdx) { bg = 'rgba(239,68,68,0.12)'; border = '1px solid #ef4444'; color = '#fca5a5' }
          return (
            <button
              key={idx}
              onClick={() => !revealed && setSelected(idx)}
              style={{
                display: 'flex', gap: '10px', padding: '11px 14px',
                backgroundColor: bg, border, borderRadius: '8px', color,
                fontSize: '13px', cursor: revealed ? 'default' : 'pointer',
                textAlign: 'left', lineHeight: '1.5',
              }}
            >
              <span style={{ fontWeight: 700, minWidth: '18px' }}>{letters[idx]})</span>
              <span style={{ flex: 1 }}>{opt.definition}</span>
              {revealed && idx === question.answerIdx && <span style={{ marginLeft: 'auto' }}>✓</span>}
              {revealed && selected === idx && idx !== question.answerIdx && <span style={{ marginLeft: 'auto' }}>✗</span>}
            </button>
          )
        })}
      </div>

      {!revealed ? (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          style={{
            padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            backgroundColor: selected !== null ? 'rgba(249,115,22,0.15)' : '#22263a',
            border: `1px solid ${selected !== null ? '#f97316' : '#374151'}`,
            color: selected !== null ? '#fdba74' : '#475569',
            cursor: selected !== null ? 'pointer' : 'not-allowed',
          }}
        >
          Check Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          style={{ padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, backgroundColor: 'rgba(249,115,22,0.15)', border: '1px solid #f97316', color: '#fdba74', cursor: 'pointer' }}
        >
          {qIndex + 1 >= quizTerms.length ? 'See Results' : 'Next →'}
        </button>
      )}
    </div>
  )
}

// ── MAIN MODULE ───────────────────────────────────────────────────────────────

const MODES = [
  { id: 'browse', label: 'Browse' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'quiz', label: 'Quiz' },
]

export default function TermsModule() {
  const [mode, setMode] = useState('browse')
  const [activeSections, setActiveSections] = useState([]) // empty = all

  const toggleSection = useCallback((id) => {
    setActiveSections(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [])

  const totalTerms = activeSections.length === 0
    ? allTerms.length
    : allTerms.filter(t => activeSections.includes(t.sectionId)).length

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
          Terms & Definitions
        </div>
        <div style={{ color: '#64748b', fontSize: '13px' }}>
          {allTerms.length} terms across {termSections.length} sections
        </div>
      </div>

      {/* Section filter */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Filter by Section {activeSections.length > 0 && `· ${totalTerms} terms selected`}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setActiveSections([])}
            style={{
              padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
              border: `1px solid ${activeSections.length === 0 ? '#e2e8f0' : '#2d3148'}`,
              backgroundColor: activeSections.length === 0 ? 'rgba(226,232,240,0.1)' : 'transparent',
              color: activeSections.length === 0 ? '#e2e8f0' : '#64748b',
              fontWeight: activeSections.length === 0 ? 600 : 400,
            }}
          >
            All ({allTerms.length})
          </button>
          {termSections.map(s => (
            <SectionPill
              key={s.id}
              section={s}
              active={activeSections.includes(s.id)}
              onClick={() => toggleSection(s.id)}
            />
          ))}
        </div>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '24px', backgroundColor: '#1a1d27', border: '1px solid #2d3148', borderRadius: '8px', padding: '4px' }}>
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
              backgroundColor: mode === m.id ? '#22263a' : 'transparent',
              color: mode === m.id ? '#e2e8f0' : '#64748b',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Mode content */}
      {mode === 'browse' && <BrowseMode activeSectionIds={activeSections} />}
      {mode === 'flashcards' && <FlashcardMode key={activeSections.join(',')} activeSectionIds={activeSections} />}
      {mode === 'quiz' && <QuizMode key={activeSections.join(',')} activeSectionIds={activeSections} />}
    </div>
  )
}
