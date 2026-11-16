
import { useState } from 'react';
import api from '../services/api';

const algorithms = [
  {
    id: 'forward',
    name: 'Forward Chaining',
    short: 'FC',
    type: 'Data-driven reasoning',
    description: 'Uses known symptoms to derive possible faults.',
    endpoint: '/algorithms/forward'
  },
  {
    id: 'backward',
    name: 'Backward Chaining',
    short: 'BC',
    type: 'Goal-driven reasoning',
    description: 'Starts with a fault hypothesis and verifies its conditions.',
    endpoint: '/algorithms/backward'
  },
  {
    id: 'entailment',
    name: 'Entailment',
    short: 'EN',
    type: 'Logical consequence',
    description: 'Checks whether a conclusion follows from known facts.',
    endpoint: '/algorithms/entailment'
  },
  {
    id: 'resolution',
    name: 'Resolution',
    short: 'RS',
    type: 'Propositional logic',
    description: 'Uses complementary literals to prove a logical conclusion.',
    endpoint: '/algorithms/resolution'
  }
];

export default function Algorithms() {
  const [selected, setSelected] = useState('forward');
  const [facts, setFacts] = useState('device_not_powering');
  const [goal, setGoal] = useState(
    'Possible power supply or connection fault'
  );
  const [conclusion, setConclusion] = useState(
    'Possible power supply or connection fault'
  );
  const [clauses, setClauses] = useState('[["A"], ["!A", "B"]]');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const active = algorithms.find(a => a.id === selected);

  const runAlgorithm = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const factList = facts.split(',').map(x => x.trim()).filter(Boolean);
      let payload = {};

      if (selected === 'forward') {
        payload = { facts: factList };
      }

      if (selected === 'backward') {
        payload = { facts: factList, goal };
      }

      if (selected === 'entailment') {
        payload = { facts: factList, conclusion };
      }

      if (selected === 'resolution') {
        const parsed = JSON.parse(clauses);
        if (!Array.isArray(parsed)) {
          throw new Error('Enter clauses as a JSON array.');
        }
        payload = { clauses: parsed, goal };
      }

      const response = await api.post(active.endpoint, payload);
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Algorithm execution failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      color: 'var(--text, #edf0fa)',
      paddingBottom: 30,
      maxWidth: 1100
    },
    muted: {
      color: 'var(--muted, #929bb3)',
      fontSize: 13
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: 'minmax(210px, 0.75fr) minmax(0, 2fr)',
      gap: 20,
      alignItems: 'start'
    },
    panel: {
      background: 'var(--panel, #202438)',
      border: '1px solid var(--border, #34394e)',
      borderRadius: 13,
      padding: 19
    },
    item: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      textAlign: 'left',
      padding: '13px 11px',
      borderRadius: 9,
      border: '1px solid transparent',
      background: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      marginTop: 7
    },
    selected: {
      background: 'rgba(139, 112, 255, 0.13)',
      borderColor: 'rgba(139, 112, 255, 0.55)'
    },
    icon: {
      width: 36,
      height: 36,
      flexShrink: 0,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 9,
      background: 'rgba(139, 112, 255, 0.17)',
      color: '#b7a5ff',
      fontSize: 12,
      fontWeight: 800
    },
    label: {
      display: 'block',
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 8
    },
    input: {
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px 13px',
      borderRadius: 8,
      border: '1px solid var(--border, #3b4056)',
      background: 'var(--surface, #171b2d)',
      color: 'inherit',
      outline: 'none',
      fontSize: 13,
      marginBottom: 17
    },
    button: {
      background: '#8469f3',
      color: '#fff',
      border: 0,
      borderRadius: 8,
      padding: '12px 19px',
      fontWeight: 700,
      cursor: 'pointer',
      fontSize: 13
    }
  };

  return (
    <div style={styles.page}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 23
      }}>
        <div>
          <h1 style={{ margin: '0 0 7px' }}>AI Algorithms</h1>
          <p style={styles.muted}>
            Explore and execute HomeSense reasoning systems.
          </p>
        </div>

        <span style={{
          ...styles.muted,
          border: '1px solid var(--border, #34394e)',
          padding: '7px 11px',
          borderRadius: 20
        }}>
          ● AI ENGINE CONNECTED
        </span>
      </div>

      <div style={styles.layout}>
        <aside style={styles.panel}>
          <p style={{
            ...styles.muted,
            fontWeight: 700,
            letterSpacing: 1
          }}>
            REASONING METHODS
          </p>

          {algorithms.map(item => (
            <button
              key={item.id}
              style={{
                ...styles.item,
                ...(selected === item.id ? styles.selected : {})
              }}
              onClick={() => {
                setSelected(item.id);
                setResult(null);
                setError('');
              }}
            >
              <span style={styles.icon}>{item.short}</span>
              <span>
                <strong style={{ display: 'block', fontSize: 12 }}>
                  {item.name}
                </strong>
                <span style={{ ...styles.muted, fontSize: 10 }}>
                  {item.type}
                </span>
              </span>
            </button>
          ))}
        </aside>

        <main>
          <section style={styles.panel}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div>
                <span style={{
                  color: '#a995ff',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1
                }}>
                  ALGORITHM WORKSPACE
                </span>
                <h2 style={{ margin: '8px 0' }}>{active.name}</h2>
              </div>
              <span style={{
                fontSize: 11,
                padding: '6px 10px',
                borderRadius: 20,
                background: 'rgba(139,112,255,.14)',
                color: '#b9a8ff'
              }}>
                {active.type}
              </span>
            </div>

            <p style={styles.muted}>{active.description}</p>

            <div style={{
              height: 1,
              background: 'var(--border, #34394e)',
              margin: '18px 0'
            }} />

            {selected !== 'resolution' && (
              <>
                <label style={styles.label}>Input facts / symptoms</label>
                <input
                  style={styles.input}
                  value={facts}
                  onChange={e => setFacts(e.target.value)}
                  placeholder="Enter facts separated by commas"
                />
              </>
            )}

            {(selected === 'backward' || selected === 'resolution') && (
              <>
                <label style={styles.label}>Goal / hypothesis</label>
                <input
                  style={styles.input}
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  placeholder="Enter a goal"
                />
              </>
            )}

            {selected === 'entailment' && (
              <>
                <label style={styles.label}>Conclusion to verify</label>
                <input
                  style={styles.input}
                  value={conclusion}
                  onChange={e => setConclusion(e.target.value)}
                  placeholder="Enter conclusion"
                />
              </>
            )}

            {selected === 'resolution' && (
              <>
                <label style={styles.label}>Propositional clauses (JSON)</label>
                <textarea
                  style={{
                    ...styles.input,
                    minHeight: 100,
                    fontFamily: 'monospace'
                  }}
                  value={clauses}
                  onChange={e => setClauses(e.target.value)}
                />
              </>
            )}

            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1
              }}
              onClick={runAlgorithm}
              disabled={loading}
            >
              {loading ? 'Executing...' : '▶  Run Algorithm'}
            </button>
          </section>

          {error && (
            <section style={{
              ...styles.panel,
              marginTop: 17,
              borderColor: '#e36a79',
              color: '#ff9ba6'
            }}>
              <strong>Execution error</strong>
              <p>{error}</p>
            </section>
          )}

          {result && (
            <section style={{
              ...styles.panel,
              marginTop: 17
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10
              }}>
                <h3 style={{ margin: 0 }}>Execution Results</h3>
                <span style={{
                  fontSize: 11,
                  color: '#8de0b2'
                }}>
                  ● COMPLETED
                </span>
              </div>

              {result.entailed !== undefined && (
                <p style={{ marginTop: 18 }}>
                  <strong>Entailment:</strong>{' '}
                  {result.entailed ? 'Proved' : 'Not proved'}
                </p>
              )}

              {result.unsatisfiable !== undefined && (
                <p style={{ marginTop: 18 }}>
                  <strong>Contradiction:</strong>{' '}
                  {result.unsatisfiable ? 'Found' : 'Not found'}
                </p>
              )}

              {result.derived_facts && (
                <>
                  <h4>Derived facts</h4>
                  {result.derived_facts.map((fact, i) => (
                    <p key={i} style={styles.muted}>• {fact}</p>
                  ))}
                </>
              )}

              {result.fired_rules && (
                <p style={styles.muted}>
                  Rules fired: {result.fired_rules.join(', ') || 'None'}
                </p>
              )}

              {result.trace && (
                <>
                  <h4>Reasoning trace</h4>
                  <div style={{
                    borderLeft: '2px solid #8c75f5',
                    paddingLeft: 15
                  }}>
                    {result.trace.map((step, i) => (
                      <p key={i} style={{
                        ...styles.muted,
                        lineHeight: 1.6
                      }}>
                        <span style={{ color: '#aa96ff' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {'  '}{step}
                      </p>
                    ))}
                  </div>
                </>
              )}

              <details style={{ marginTop: 18 }}>
                <summary style={{ cursor: 'pointer', fontSize: 13 }}>
                  View complete API response
                </summary>
                <pre style={{
                  ...styles.muted,
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                  padding: 13,
                  background: 'var(--surface, #171b2d)',
                  borderRadius: 8
                }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </section>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .algorithm-unused {}
        }
        @media (max-width: 760px) {
          main { min-width: 0; }
        }
      `}</style>
    </div>
  );
}
