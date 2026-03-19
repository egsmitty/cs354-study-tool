import { useState } from 'react'
import { codeSnippets, fillInBlanks } from '../data/codeSnippets'

function highlightC(code) {
  const keywords = [
    'int', 'char', 'float', 'double', 'void', 'if', 'else', 'for', 'while',
    'return', 'struct', 'malloc', 'free', 'printf', 'NULL', 'sizeof',
  ]

  // Apply a transform only to text nodes (not inside HTML tags)
  function applyToText(html, transform) {
    return html.replace(/(<[^>]*>)|([^<]+)/g, (match, tag, text) => {
      if (tag) return tag
      if (text) return transform(text)
      return match
    })
  }

  const lines = code.split('\n')
  return lines.map(line => {
    // HTML-escape first so < > & in C code don't corrupt span tag attributes
    let hl = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Comments first
    hl = hl.replace(/(\/\/.*$)/, '<span style="color:#6b7280;font-style:italic">$1</span>')
    const commentStart = hl.indexOf('<span style="color:#6b7280')
    let safe = commentStart !== -1 ? hl.slice(0, commentStart) : hl
    const comment = commentStart !== -1 ? hl.slice(commentStart) : ''

    // Strings
    safe = applyToText(safe, t => t.replace(/"([^"]*)"/g, '<span style="color:#22c55e">"$1"</span>'))
    // Numbers
    safe = applyToText(safe, t => t.replace(/\b(\d+)\b/g, '<span style="color:#f59e0b">$1</span>'))
    // Keywords
    keywords.forEach(kw => {
      safe = applyToText(safe, t => t.replace(
        new RegExp(`\\b${kw}\\b`, 'g'),
        `<span style="color:#60a5fa;font-weight:600">${kw}</span>`,
      ))
    })
    // Operators — also match HTML-escaped < > & so they render colored
    safe = applyToText(safe, t => t.replace(
      /([*\-\+\[\]{}()=!]|&lt;|&gt;|&amp;)/g,
      '<span style="color:#f472b6">$1</span>',
    ))

    return safe + comment
  }).join('\n')
}

function CodeBlock({ code, highlightLine }) {
  const lines = code.split('\n')
  return (
    <div style={{
      backgroundColor: '#0f1117',
      border: '1px solid #2d3148',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '13px',
      lineHeight: '1.6',
    }}>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            backgroundColor: i + 1 === highlightLine ? 'rgba(59,130,246,0.15)' : 'transparent',
            borderLeft: i + 1 === highlightLine ? '3px solid #3b82f6' : '3px solid transparent',
          }}
        >
          <span style={{
            color: '#374151',
            padding: '0 12px 0 8px',
            userSelect: 'none',
            minWidth: '36px',
            textAlign: 'right',
          }}>
            {i + 1}
          </span>
          <span
            style={{ padding: '0 12px 0 0', flex: 1 }}
            dangerouslySetInnerHTML={{ __html: highlightC(line) }}
          />
        </div>
      ))}
    </div>
  )
}

function VarTable({ vars }) {
  const entries = Object.entries(vars)
  if (entries.length === 0) return null
  return (
    <div style={{
      backgroundColor: '#0f1117',
      border: '1px solid #374151',
      borderRadius: '6px',
      overflow: 'hidden',
      marginTop: '10px',
    }}>
      <div style={{ color: '#64748b', fontSize: '11px', padding: '6px 10px', borderBottom: '1px solid #374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Variable State
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
        {entries.map(([k, v]) => (
          <div key={k} style={{
            display: 'flex', gap: '6px', alignItems: 'center',
            padding: '5px 10px',
            borderRight: '1px solid #1a1d27',
          }}>
            <span style={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '12px' }}>{k}</span>
            <span style={{ color: '#475569', fontSize: '12px' }}>=</span>
            <span style={{ color: '#f59e0b', fontFamily: 'monospace', fontSize: '12px' }}>{String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SnippetCard({ snippet }) {
  const [stepIdx, setStepIdx] = useState(-1)
  const [running, setRunning] = useState(false)

  const currentStep = stepIdx >= 0 && stepIdx < snippet.steps.length ? snippet.steps[stepIdx] : null

  const start = () => { setRunning(true); setStepIdx(0) }
  const next = () => { if (stepIdx < snippet.steps.length - 1) setStepIdx(s => s + 1) }
  const prev = () => { if (stepIdx > 0) setStepIdx(s => s - 1) }
  const reset = () => { setRunning(false); setStepIdx(-1) }

  return (
    <div style={{
      backgroundColor: '#1a1d27',
      border: '1px solid #2d3148',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', borderBottom: '1px solid #2d3148',
        backgroundColor: '#22263a',
      }}>
        <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600 }}>
          {snippet.id}. {snippet.title}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {running && (
            <span style={{ color: '#64748b', fontSize: '12px' }}>
              Step {stepIdx + 1}/{snippet.steps.length}
            </span>
          )}
          {!running ? (
            <button onClick={start}
              style={{ padding: '5px 12px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '5px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>
              Step Through ▶
            </button>
          ) : (
            <>
              <button onClick={prev} disabled={stepIdx === 0}
                style={{ padding: '5px 10px', backgroundColor: stepIdx > 0 ? '#22263a' : '#1a1d27', border: '1px solid #374151', borderRadius: '5px', color: stepIdx > 0 ? '#94a3b8' : '#374151', fontSize: '12px', cursor: stepIdx > 0 ? 'pointer' : 'not-allowed' }}>
                ←
              </button>
              <button onClick={next} disabled={stepIdx === snippet.steps.length - 1}
                style={{ padding: '5px 10px', backgroundColor: stepIdx < snippet.steps.length - 1 ? '#3b82f6' : '#22263a', border: '1px solid ' + (stepIdx < snippet.steps.length - 1 ? '#3b82f6' : '#374151'), borderRadius: '5px', color: '#fff', fontSize: '12px', cursor: stepIdx < snippet.steps.length - 1 ? 'pointer' : 'default' }}>
                →
              </button>
              <button onClick={reset}
                style={{ padding: '5px 10px', backgroundColor: '#22263a', border: '1px solid #374151', borderRadius: '5px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }}>
        {/* Code */}
        <div style={{ flex: '1 1 320px', padding: '14px' }}>
          <CodeBlock code={snippet.code} highlightLine={currentStep?.line} />
          {/* Progress bar */}
          {running && (
            <div style={{ marginTop: '10px', height: '3px', backgroundColor: '#22263a', borderRadius: '2px' }}>
              <div style={{
                width: `${((stepIdx + 1) / snippet.steps.length) * 100}%`,
                height: '100%', backgroundColor: '#3b82f6', borderRadius: '2px',
                transition: 'width 0.2s',
              }} />
            </div>
          )}
        </div>

        {/* Step explanation */}
        <div style={{ flex: '1 1 240px', padding: '14px', borderLeft: '1px solid #2d3148' }}>
          {currentStep ? (
            <>
              <div style={{
                backgroundColor: '#22263a',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '10px',
              }}>
                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Step {stepIdx + 1}
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: '1.6' }}>
                  {currentStep.description}
                </div>
              </div>
              <VarTable vars={currentStep.vars} />
            </>
          ) : (
            <div style={{ color: '#475569', fontSize: '13px', paddingTop: '8px' }}>
              Click "Step Through" to trace execution step by step.
            </div>
          )}

          {/* Output (show at last step) */}
          {running && stepIdx === snippet.steps.length - 1 && (
            <div style={{
              marginTop: '10px',
              backgroundColor: '#0f1117',
              border: '1px solid #374151',
              borderRadius: '6px',
              padding: '10px',
            }}>
              <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '6px' }}>OUTPUT</div>
              <pre style={{ color: '#22c55e', fontSize: '13px', margin: 0, fontFamily: 'monospace' }}>
                {snippet.output}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FillInCard({ blank, onAnswer }) {
  const [input, setInput] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(false)

  const check = () => {
    const trimmed = input.trim().replace(/\s+/g, ' ')
    const isCorrect = blank.acceptedAnswers.some(ans =>
      ans.toLowerCase() === trimmed.toLowerCase()
    )
    setCorrect(isCorrect)
    setRevealed(true)
    onAnswer(isCorrect)
  }

  return (
    <div style={{
      backgroundColor: '#1a1d27',
      border: '1px solid #2d3148',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '12px',
    }}>
      <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>
        {blank.id}. {blank.prompt}
      </div>
      <div style={{ marginBottom: '14px' }}>
        <CodeBlock code={blank.code} />
      </div>
      {!revealed ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && input && check()}
            placeholder="Type your answer..."
            style={{
              padding: '8px 12px',
              backgroundColor: '#0f1117',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontSize: '13px',
              fontFamily: 'monospace',
              outline: 'none',
              width: '240px',
            }}
          />
          <button onClick={check} disabled={!input}
            style={{ padding: '8px 14px', backgroundColor: input ? '#a78bfa' : '#22263a', border: '1px solid ' + (input ? '#a78bfa' : '#374151'), borderRadius: '6px', color: input ? '#fff' : '#475569', fontSize: '13px', cursor: input ? 'pointer' : 'not-allowed' }}>
            Check
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px',
            backgroundColor: correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${correct ? '#22c55e' : '#ef4444'}`,
            borderRadius: '6px',
            marginBottom: '10px',
          }}>
            <span style={{ fontSize: '16px' }}>{correct ? '✓' : '✗'}</span>
            <span style={{ color: correct ? '#86efac' : '#fca5a5', fontSize: '13px' }}>
              Your answer: <code style={{ fontFamily: 'monospace' }}>{input}</code>
              {!correct && (
                <> — Correct: <code style={{ color: '#86efac', fontFamily: 'monospace' }}>{blank.acceptedAnswers[0]}</code></>
              )}
            </span>
          </div>
          <div style={{ backgroundColor: '#0f1117', border: '1px solid #374151', borderRadius: '6px', padding: '10px 12px', color: '#94a3b8', fontSize: '13px', lineHeight: 1.6 }}>
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>Explanation: </span>{blank.explanation}
          </div>
        </div>
      )}
    </div>
  )
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

export default function CodeTracer() {
  const [codeStats, setCodeStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('code_accuracy') || '{"correct":0,"total":0}') } catch { return { correct: 0, total: 0 } }
  })

  const handleAnswer = (correct) => {
    const updated = { correct: codeStats.correct + (correct ? 1 : 0), total: codeStats.total + 1 }
    setCodeStats(updated)
    localStorage.setItem('code_accuracy', JSON.stringify(updated))
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>🔍 C Code Tracer</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Step through C snippets · Fill-in-the-blank exercises</p>
      </div>

      {/* Section 1: Code Step-Through */}
      <div style={{ marginBottom: '36px' }}>
        <SectionHeader>Section 1 — Code Step-Through (8 snippets)</SectionHeader>
        {codeSnippets.map(snippet => <SnippetCard key={snippet.id} snippet={snippet} />)}
      </div>

      {/* Section 2: Fill in the Blank */}
      <div>
        <SectionHeader>
          Section 2 — Fill in the Blank
          {codeStats.total > 0 && (
            <span style={{ marginLeft: '12px', color: '#e2e8f0' }}>
              {codeStats.correct}/{codeStats.total} correct ({Math.round((codeStats.correct / codeStats.total) * 100)}%)
            </span>
          )}
        </SectionHeader>
        {fillInBlanks.map(blank => (
          <FillInCard key={blank.id} blank={blank} onAnswer={handleAnswer} />
        ))}
      </div>
    </div>
  )
}
