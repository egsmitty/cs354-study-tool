import { useState, useEffect, useRef } from 'react'
import { examQuestions } from '../data/examQuestions'

const QUESTION_COUNTS = [
  { label: '11 questions (quick)', value: 11 },
  { label: '15 questions (medium)', value: 15 },
  { label: '22 questions (full)', value: 22 },
]

const TIME_LIMITS = [
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
  { label: '90 min', value: 90 },
]

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function selectQuestions(count) {
  // Ensure topic coverage
  const heap = shuffleArray(examQuestions.filter(q => q.topic === 'heap'))
  const cache = shuffleArray(examQuestions.filter(q => q.topic === 'cache'))
  const code = shuffleArray(examQuestions.filter(q => q.topic === 'code'))

  if (count >= 22) return shuffleArray(examQuestions)

  // Proportional selection
  const heapCount = Math.ceil(count * (8 / 22))
  const cacheCount = Math.ceil(count * (8 / 22))
  const codeCount = count - heapCount - cacheCount

  return shuffleArray([
    ...heap.slice(0, heapCount),
    ...cache.slice(0, cacheCount),
    ...code.slice(0, Math.max(0, codeCount)),
  ]).slice(0, count)
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function topicColor(topic) {
  return topic === 'heap' ? '#3b82f6' : topic === 'cache' ? '#14b8a6' : '#a78bfa'
}

function topicLabel(topic) {
  return topic === 'heap' ? 'Heap' : topic === 'cache' ? 'Cache' : 'Code'
}

// Setup Screen
function SetupScreen({ onStart }) {
  const [qCount, setQCount] = useState(15)
  const [timeLimit, setTimeLimit] = useState(45)

  return (
    <div style={{ padding: '40px 32px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 700, margin: '0 0 6px' }}>📝 Practice Exam</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
          Simulates real CS354 exam conditions with a countdown timer.
        </p>
      </div>

      <div style={{ backgroundColor: '#1a1d27', border: '1px solid #2d3148', borderRadius: '10px', padding: '28px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Question Count
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {QUESTION_COUNTS.map(opt => (
              <button key={opt.value} onClick={() => setQCount(opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: qCount === opt.value ? 'rgba(59,130,246,0.15)' : '#22263a',
                  border: `1px solid ${qCount === opt.value ? '#3b82f6' : '#374151'}`,
                  borderRadius: '6px', color: qCount === opt.value ? '#93c5fd' : '#94a3b8',
                  fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: `2px solid ${qCount === opt.value ? '#3b82f6' : '#4b5563'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {qCount === opt.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />}
                </div>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Time Limit
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {TIME_LIMITS.map(opt => (
              <button key={opt.value} onClick={() => setTimeLimit(opt.value)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: timeLimit === opt.value ? 'rgba(59,130,246,0.15)' : '#22263a',
                  border: `1px solid ${timeLimit === opt.value ? '#3b82f6' : '#374151'}`,
                  borderRadius: '6px', color: timeLimit === opt.value ? '#93c5fd' : '#94a3b8',
                  fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topic breakdown */}
      <div style={{ backgroundColor: '#1a1d27', border: '1px solid #2d3148', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Topic Coverage
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { label: 'Heap', color: '#3b82f6', pct: '~36%' },
            { label: 'Cache', color: '#14b8a6', pct: '~36%' },
            { label: 'Code', color: '#a78bfa', pct: '~27%' },
          ].map(t => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: t.color }} />
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>{t.label}: {t.pct}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => onStart(qCount, timeLimit)}
        style={{
          width: '100%', padding: '14px',
          backgroundColor: '#3b82f6', border: 'none',
          borderRadius: '8px', color: '#fff',
          fontSize: '16px', fontWeight: 600, cursor: 'pointer',
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563eb'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
      >
        Start Exam →
      </button>
    </div>
  )
}

// Question Screen
function QuestionScreen({ questions, timeLimit, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          finishExam(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const finishExam = (timedOut = false) => {
    clearInterval(timerRef.current)
    onFinish(answers, timedOut)
  }

  const q = questions[currentIdx]
  const letters = ['A', 'B', 'C', 'D']

  const handleSelect = (idx) => {
    if (submitted) return
    setSelected(idx)
  }

  const handleNext = () => {
    if (selected === null) return
    const newAnswers = [...answers]
    newAnswers[currentIdx] = selected
    setAnswers(newAnswers)
    setSelected(null)
    setSubmitted(false)

    if (currentIdx === questions.length - 1) {
      finishExam(false)
    } else {
      setCurrentIdx(i => i + 1)
    }
  }

  const timerColor = timeLeft < 120 ? '#ef4444' : timeLeft < 300 ? '#f59e0b' : '#22c55e'
  const progress = ((currentIdx) / questions.length) * 100

  return (
    <div style={{ padding: '28px 32px', maxWidth: '800px' }}>
      {/* Header: timer + progress */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px', flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ color: '#64748b', fontSize: '14px' }}>
          Question <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{currentIdx + 1}</span>/{questions.length}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: '#1a1d27', border: `1px solid ${timerColor}40`,
          borderRadius: '8px', padding: '8px 16px',
        }}>
          <span style={{ fontSize: '16px' }}>⏱</span>
          <span style={{ color: timerColor, fontFamily: 'monospace', fontSize: '20px', fontWeight: 700 }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', backgroundColor: '#22263a', borderRadius: '2px', marginBottom: '24px' }}>
        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '2px', transition: 'width 0.3s' }} />
      </div>

      {/* Question dots */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            width: '24px', height: '24px', borderRadius: '4px',
            backgroundColor: i === currentIdx ? '#3b82f6' : answers[i] !== null ? '#22c55e' : '#22263a',
            border: `1px solid ${i === currentIdx ? '#3b82f6' : answers[i] !== null ? '#22c55e' : '#374151'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '10px', cursor: 'default',
          }}>
            {i + 1}
          </div>
        ))}
      </div>

      {/* Question card */}
      <div style={{
        backgroundColor: '#1a1d27', border: '1px solid #2d3148',
        borderRadius: '10px', padding: '24px', marginBottom: '16px',
      }}>
        {/* Topic badge + points */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
          <span style={{
            padding: '3px 8px',
            backgroundColor: `${topicColor(q.topic)}20`,
            border: `1px solid ${topicColor(q.topic)}40`,
            borderRadius: '4px', color: topicColor(q.topic),
            fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {topicLabel(q.topic)}
          </span>
          <span style={{ color: '#475569', fontSize: '12px' }}>{q.points} pts</span>
          <span style={{ color: '#374151', fontSize: '12px' }}>#{q.id}</span>
        </div>

        <div style={{ color: '#e2e8f0', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px', fontWeight: 500 }}>
          {q.question}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q.options.map((opt, idx) => {
            const isSelected = selected === idx
            return (
              <button key={idx} onClick={() => handleSelect(idx)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: isSelected ? 'rgba(59,130,246,0.15)' : '#22263a',
                  border: `1px solid ${isSelected ? '#3b82f6' : '#374151'}`,
                  borderRadius: '8px',
                  color: isSelected ? '#93c5fd' : '#94a3b8',
                  fontSize: '14px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = '#4b5563' } }}
                onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.backgroundColor = '#22263a'; e.currentTarget.style.borderColor = '#374151' } }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  border: `2px solid ${isSelected ? '#3b82f6' : '#4b5563'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: isSelected ? '#3b82f6' : 'transparent',
                  color: isSelected ? '#fff' : '#64748b',
                  fontSize: '12px', fontWeight: 700,
                }}>
                  {letters[idx]}
                </div>
                <span>{opt}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Next button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#475569', fontSize: '12px' }}>
          {selected === null ? 'Select an answer to continue' : 'Click Next to confirm and continue'}
        </div>
        <button onClick={handleNext} disabled={selected === null}
          style={{
            padding: '12px 28px',
            backgroundColor: selected !== null ? '#3b82f6' : '#22263a',
            border: '1px solid ' + (selected !== null ? '#3b82f6' : '#374151'),
            borderRadius: '8px',
            color: selected !== null ? '#fff' : '#475569',
            fontSize: '14px', fontWeight: 600,
            cursor: selected !== null ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}>
          {currentIdx === questions.length - 1 ? 'Finish Exam' : 'Next Question →'}
        </button>
      </div>
    </div>
  )
}

// Results Screen
function ResultsScreen({ questions, answers, timedOut, onRetake }) {
  const totalPts = questions.reduce((s, q) => s + q.points, 0)
  const earnedPts = questions.reduce((s, q, i) => s + (answers[i] === q.answer ? q.points : 0), 0)
  const pct = Math.round((earnedPts / totalPts) * 100)
  const correct = questions.filter((q, i) => answers[i] === q.answer).length

  const byTopic = ['heap', 'cache', 'code'].map(topic => {
    const qs = questions.filter(q => q.topic === topic)
    const c = qs.filter((q, i) => {
      const globalIdx = questions.indexOf(q)
      return answers[globalIdx] === q.answer
    }).length
    return { topic, correct: c, total: qs.length }
  })

  // Save to history
  useEffect(() => {
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const history = (() => { try { return JSON.parse(localStorage.getItem('exam_history') || '[]') } catch { return [] } })()
    history.push({ date, score: earnedPts, total: totalPts, pct })
    localStorage.setItem('exam_history', JSON.stringify(history))
  }, [])

  const gradeColor = pct >= 90 ? '#22c55e' : pct >= 80 ? '#84cc16' : pct >= 70 ? '#f59e0b' : pct >= 60 ? '#fb923c' : '#ef4444'
  const gradeLabel = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F'
  const letters = ['A', 'B', 'C', 'D']

  return (
    <div style={{ padding: '28px 32px', maxWidth: '800px' }}>
      {timedOut && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '10px 14px', marginBottom: '20px', color: '#fca5a5', fontSize: '13px' }}>
          ⏱ Time expired — exam submitted automatically.
        </div>
      )}

      {/* Score hero */}
      <div style={{
        backgroundColor: '#1a1d27', border: '1px solid #2d3148',
        borderRadius: '12px', padding: '28px',
        background: 'linear-gradient(135deg, #1a1d27, #1e2235)',
        marginBottom: '20px',
        display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ textAlign: 'center', minWidth: '100px' }}>
          <div style={{ color: gradeColor, fontSize: '56px', fontWeight: 800, lineHeight: 1 }}>{pct}%</div>
          <div style={{ color: gradeColor, fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>Grade: {gradeLabel}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            {earnedPts}/{totalPts} points · {correct}/{questions.length} correct
          </div>
          <div style={{ height: '8px', backgroundColor: '#22263a', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: gradeColor, borderRadius: '4px', transition: 'width 0.5s' }} />
          </div>
          {/* By topic */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {byTopic.map(t => (
              <div key={t.topic} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: topicColor(t.topic) }} />
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                  {topicLabel(t.topic)}: {t.correct}/{t.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question review */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #2d3148' }}>
          Question Review
        </div>
        {questions.map((q, i) => {
          const userAnswer = answers[i]
          const isCorrect = userAnswer === q.answer
          return (
            <div key={q.id} style={{
              backgroundColor: '#1a1d27', border: '1px solid #2d3148',
              borderRadius: '8px', padding: '16px', marginBottom: '8px',
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: isCorrect ? '#22c55e' : '#ef4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '11px', fontWeight: 700, marginTop: '2px',
                }}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                    <span style={{
                      padding: '2px 6px',
                      backgroundColor: `${topicColor(q.topic)}15`,
                      border: `1px solid ${topicColor(q.topic)}30`,
                      borderRadius: '3px', color: topicColor(q.topic), fontSize: '10px',
                    }}>
                      {topicLabel(q.topic)}
                    </span>
                    <span style={{ color: '#475569', fontSize: '11px' }}>{q.points}pts</span>
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: 1.5, marginBottom: '8px' }}>
                    {q.question}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', flexWrap: 'wrap' }}>
                    <span style={{ color: userAnswer !== null ? (isCorrect ? '#86efac' : '#fca5a5') : '#475569' }}>
                      Your answer: {userAnswer !== null ? `${letters[userAnswer]}) ${q.options[userAnswer]}` : 'Not answered'}
                    </span>
                    {!isCorrect && (
                      <span style={{ color: '#86efac' }}>
                        Correct: {letters[q.answer]}) {q.options[q.answer]}
                      </span>
                    )}
                  </div>
                  <div style={{
                    marginTop: '8px', backgroundColor: '#0f1117',
                    border: '1px solid #2d3148', borderRadius: '4px',
                    padding: '8px 10px', color: '#94a3b8', fontSize: '12px', lineHeight: 1.6,
                  }}>
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onRetake}
          style={{ padding: '12px 24px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          Take Another Exam
        </button>
      </div>
    </div>
  )
}

export default function PracticeExam() {
  const [phase, setPhase] = useState('setup') // 'setup' | 'exam' | 'results'
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [timedOut, setTimedOut] = useState(false)
  const [timeLimit, setTimeLimit] = useState(45)

  const handleStart = (count, limit) => {
    const qs = selectQuestions(count)
    setQuestions(qs)
    setTimeLimit(limit)
    setPhase('exam')
  }

  const handleFinish = (finalAnswers, wasTimedOut) => {
    setAnswers(finalAnswers)
    setTimedOut(wasTimedOut)
    setPhase('results')
  }

  if (phase === 'setup') return <SetupScreen onStart={handleStart} />
  if (phase === 'exam') return <QuestionScreen questions={questions} timeLimit={timeLimit} onFinish={handleFinish} />
  if (phase === 'results') return <ResultsScreen questions={questions} answers={answers} timedOut={timedOut} onRetake={() => setPhase('setup')} />
  return null
}
