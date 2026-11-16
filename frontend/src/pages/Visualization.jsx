
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

function getText(value) {
  if (value === null || value === undefined) return '';

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'object') {
    return value.name || value.title || value.description || JSON.stringify(value);
  }

  return '';
}

export default function Visualization() {
  const [rules, setRules] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const saved = sessionStorage.getItem('homesense_result');

        if (saved && active) {
          try {
            setResult(JSON.parse(saved));
          } catch {
            setResult(null);
          }
        }

        const response = await api.get('/knowledge/rules');

        if (active) {
          setRules(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.error ||
            'Unable to load knowledge-base information.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const trace = Array.isArray(result?.trace) ? result.trace : [];

  const symptoms = useMemo(() => {
    if (Array.isArray(result?.symptoms) && result.symptoms.length) {
      return result.symptoms.map(item =>
        getText(item).replaceAll('_', ' ')
      );
    }

    const initialFacts = trace.find(item =>
      typeof item === 'string' && /initial facts:/i.test(item)
    );

    if (initialFacts) {
      return initialFacts
        .replace(/^.*initial facts:\s*/i, '')
        .split(',')
        .map(item => item.trim().replaceAll('_', ' '))
        .filter(Boolean);
    }

    return [];
  }, [result, trace]);

  const firedRuleIds = useMemo(() => {
    const ids = new Set();

    trace.forEach(item => {
      const content = typeof item === 'string'
        ? item
        : JSON.stringify(item);

      const matches = content.matchAll(/\b(R\d+)\s+fired\b/gi);

      for (const match of matches) {
        ids.add(match[1].toUpperCase());
      }
    });

    return Array.from(ids);
  }, [trace]);

  const faults = useMemo(() => {
    if (Array.isArray(result?.faults)) {
      return result.faults.map(getText).filter(Boolean);
    }

    if (typeof result?.fault === 'string') {
      return result.fault
        .split(';')
        .map(item => item.trim())
        .filter(Boolean);
    }

    return result?.fault ? [getText(result.fault)] : [];
  }, [result]);

  const recommendations = Array.isArray(result?.recommendations)
    ? result.recommendations
    : [];

  const hasResult = Boolean(result && (result.fault || trace.length));

  function getRuleName(ruleId) {
    const index = Number(ruleId.replace('R', '')) - 1;
    const rule = rules[index];

    if (!rule) return `Rule ${ruleId}`;

    return typeof rule === 'string'
      ? rule
      : rule.name || rule.title || rule.description || `Rule ${ruleId}`;
  }

  return (
    <main className="hs-visual-page">

      {/* HEADER */}

      <header className="visual-header">
        <div>
          <span className="visual-eyebrow">
            HOMESENSE / ARTIFICIAL INTELLIGENCE
          </span>

          <h1>AI Inference Visualization</h1>

          <p>
            Explore how HomeSense transforms device symptoms into
            logical facts, evaluates knowledge rules and infers
            possible faults.
          </p>
        </div>

        <div className={`visual-engine-status ${error ? 'status-error' : ''}`}>
          <span className="visual-status-dot" />
          {error
            ? 'Connection issue'
            : loading
              ? 'Connecting...'
              : 'Inference engine ready'}
        </div>
      </header>

      {error && <div className="visual-error">{error}</div>}

      {/* STATISTICS */}

      <section className="visual-stats">

        <article className="visual-stat-card">
          <span className="visual-stat-icon">01</span>
          <div>
            <p>Knowledge rules</p>
            <h2>{loading ? '—' : rules.length}</h2>
          </div>
        </article>

        <article className="visual-stat-card">
          <span className="visual-stat-icon">02</span>
          <div>
            <p>Input symptoms</p>
            <h2>{hasResult ? symptoms.length : '—'}</h2>
          </div>
        </article>

        <article className="visual-stat-card">
          <span className="visual-stat-icon">03</span>
          <div>
            <p>Rules activated</p>
            <h2>{hasResult ? firedRuleIds.length : '—'}</h2>
          </div>
        </article>

        <article className="visual-stat-card">
          <span className="visual-stat-icon">04</span>
          <div>
            <p>Possible faults</p>
            <h2>{hasResult ? faults.length : '—'}</h2>
          </div>
        </article>

      </section>

      {/* GRAPHICAL AI REASONING DIAGRAM */}

      <section className="visual-graph-panel">

        <div className="visual-graph-heading">
          <div>
            <span className="visual-section-label">
              LIVE REASONING MODEL
            </span>

            <h2>AI Diagnosis Flow</h2>

            <p>
              A graphical representation of the diagnosis process.
              The nodes use the available diagnosis information.
            </p>
          </div>

          <span className="visual-graph-badge">
            {hasResult ? 'RESULT AVAILABLE' : 'WAITING FOR INPUT'}
          </span>
        </div>

        <div className="visual-flow">

          {/* STAGE 1: SYMPTOMS */}

          <div className="visual-flow-stage">
            <div className="visual-flow-node input-node">

              <div className="visual-node-icon">
                <span>⌂</span>
              </div>

              <span className="visual-node-label">STAGE 01</span>

              <h3>Device Symptoms</h3>

              <p className="visual-node-description">
                User reported problems
              </p>

              <div className="visual-node-items">
                {symptoms.length ? (
                  symptoms.map((item, index) => (
                    <div className="visual-node-item" key={index}>
                      <span>●</span>
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="visual-node-empty">
                    No symptoms loaded
                  </div>
                )}
              </div>

              <div className="visual-node-count">
                {symptoms.length} INPUTS
              </div>

            </div>
          </div>

          <div className="visual-flow-connector">
            <span>→</span>
            <small>Convert</small>
          </div>

          {/* STAGE 2: FACTS */}

          <div className="visual-flow-stage">
            <div className="visual-flow-node fact-node">

              <div className="visual-node-icon">
                <span>F</span>
              </div>

              <span className="visual-node-label">STAGE 02</span>

              <h3>Logical Facts</h3>

              <p className="visual-node-description">
                Propositional representation
              </p>

              <div className="visual-node-items">
                {symptoms.length ? (
                  symptoms.map((item, index) => (
                    <div className="visual-node-item" key={index}>
                      <span>✓</span>
                      {item.replaceAll(' ', '_')}
                    </div>
                  ))
                ) : (
                  <div className="visual-node-empty">
                    Facts will appear here
                  </div>
                )}
              </div>

              <div className="visual-node-count">
                {symptoms.length} FACTS
              </div>

            </div>
          </div>

          <div className="visual-flow-connector">
            <span>→</span>
            <small>Evaluate</small>
          </div>

          {/* STAGE 3: KNOWLEDGE BASE */}

          <div className="visual-flow-stage">
            <div className="visual-flow-node rule-node">

              <div className="visual-node-icon">
                <span>IF</span>
              </div>

              <span className="visual-node-label">STAGE 03</span>

              <h3>Knowledge Base</h3>

              <p className="visual-node-description">
                IF–THEN rule evaluation
              </p>

              <div className="visual-node-items">
                {firedRuleIds.length ? (
                  firedRuleIds.map(ruleId => (
                    <div className="visual-node-item" key={ruleId}>
                      <span>✓</span>
                      <div>
                        <strong>{ruleId}</strong>
                        <small>{getRuleName(ruleId)}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="visual-node-empty">
                    {loading
                      ? 'Loading rules...'
                      : `${rules.length} rules available`}
                  </div>
                )}
              </div>

              <div className="visual-node-count">
                {firedRuleIds.length} RULES FIRED
              </div>

            </div>
          </div>

          <div className="visual-flow-connector">
            <span>→</span>
            <small>Infer</small>
          </div>

          {/* STAGE 4: INFERENCE ENGINE */}

          <div className="visual-flow-stage">
            <div className="visual-flow-node engine-node">

              <div className="visual-node-icon">
                <span>AI</span>
              </div>

              <span className="visual-node-label">STAGE 04</span>

              <h3>Inference Engine</h3>

              <p className="visual-node-description">
                Logical reasoning process
              </p>

              <div className="visual-engine-graphic">
                <div className="visual-engine-circle">
                  <span>AI</span>
                </div>
                <div className="visual-engine-lines">
                  <i />
                  <i />
                  <i />
                </div>
              </div>

              <div className="visual-engine-info">
                {hasResult
                  ? `${trace.length} reasoning steps recorded`
                  : 'Waiting for diagnosis'}
              </div>

              <div className="visual-node-count">
                {hasResult ? 'PROCESSED' : 'STANDBY'}
              </div>

            </div>
          </div>

          <div className="visual-flow-connector">
            <span>→</span>
            <small>Conclude</small>
          </div>

          {/* STAGE 5: OUTPUT */}

          <div className="visual-flow-stage">
            <div className="visual-flow-node output-node">

              <div className="visual-node-icon">
                <span>✓</span>
              </div>

              <span className="visual-node-label">STAGE 05</span>

              <h3>Possible Faults</h3>

              <p className="visual-node-description">
                Inferred diagnosis output
              </p>

              <div className="visual-node-items">
                {faults.length ? (
                  faults.map((fault, index) => (
                    <div className="visual-node-item" key={index}>
                      <span>!</span>
                      {fault}
                    </div>
                  ))
                ) : (
                  <div className="visual-node-empty">
                    No diagnosis output
                  </div>
                )}
              </div>

              <div className="visual-node-count">
                {faults.length} POSSIBLE FAULTS
              </div>

            </div>
          </div>

        </div>

        {/* FLOW LEGEND */}

        <div className="visual-graph-legend">
          <span><i className="legend-input" /> Input</span>
          <span><i className="legend-fact" /> Facts</span>
          <span><i className="legend-rule" /> Knowledge rules</span>
          <span><i className="legend-engine" /> Inference</span>
          <span><i className="legend-output" /> Output</span>
        </div>

      </section>

      {/* INFERENCE TRACE */}

      <section className="visual-main-panel">

        <div className="visual-panel-heading">
          <div>
            <span className="visual-section-label">
              EXECUTION DETAILS
            </span>
            <h2>Inference Trace</h2>
          </div>

          <span className="visual-count">
            {trace.length} steps
          </span>
        </div>

        {trace.length ? (
          <div className="visual-trace-list">

            {trace.map((item, index) => (
              <div className="visual-trace-item" key={index}>

                <span className="visual-trace-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3>
                    {typeof item === 'string'
                      ? item
                      : item.title || item.step || item.rule_name ||
                        item.action || `Inference step ${index + 1}`}
                  </h3>

                  {typeof item === 'object' && item !== null && (
                    <p>
                      {item.explanation || item.description ||
                        item.message || item.reason || item.result || ''}
                    </p>
                  )}

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="visual-empty">
            <h3>No inference trace available</h3>
            <p>Run a diagnosis to see the actual reasoning steps.</p>
          </div>
        )}

      </section>

      {/* RECOMMENDATIONS */}

      <section className="visual-recommendations-panel">

        <div>
          <span className="visual-section-label">
            SYSTEM GUIDANCE
          </span>
          <h2>Recommended Next Steps</h2>
        </div>

        {recommendations.length ? (
          <div className="visual-recommendation-list">
            {recommendations.map((item, index) => (
              <div className="visual-recommendation-item" key={index}>
                <span>✓</span>
                <p>{getText(item)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="visual-no-recommendations">
            Recommendations will appear after a diagnosis.
          </p>
        )}

      </section>

      <footer className="visual-footer">
        HOMESENSE · AI-ASSISTED SMART HOME TROUBLESHOOTING
      </footer>

    </main>
  );
}
