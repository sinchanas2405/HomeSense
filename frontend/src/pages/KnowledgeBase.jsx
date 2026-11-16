
import { useEffect, useState } from 'react';
import api from '../services/api';
import RuleCard from '../components/RuleCard';

export default function KnowledgeBase() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRules() {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/knowledge/rules');

        setRules(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(
          err.response?.data?.error ||
          'Unable to load knowledge base. Please check the backend.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadRules();
  }, []);

  return (
    <main className="hs-knowledge-page">

      <div className="knowledge-heading">
        <div>
          <span className="knowledge-eyebrow">
            HOMESENSE · AI KNOWLEDGE ENGINE
          </span>

          <h1>Knowledge Base</h1>

          <p>
            Explore the facts and logical rules used by HomeSense
            to identify possible faults in household devices.
          </p>
        </div>

        <div className="knowledge-count">
          <span>REGISTERED RULES</span>
          <strong>{rules.length}</strong>
        </div>
      </div>

      <section className="knowledge-info-grid">

        <article className="knowledge-info-card">
          <span className="knowledge-icon">01</span>
          <h3>Knowledge Representation</h3>
          <p>
            Device symptoms and possible faults are represented
            as structured knowledge.
          </p>
        </article>

        <article className="knowledge-info-card">
          <span className="knowledge-icon">02</span>
          <h3>Facts and Rules</h3>
          <p>
            Facts describe observations, while rules connect
            conditions to possible conclusions.
          </p>
        </article>

        <article className="knowledge-info-card">
          <span className="knowledge-icon">03</span>
          <h3>Logical Inference</h3>
          <p>
            The reasoning engine applies matching rules to
            derive diagnosis results.
          </p>
        </article>

      </section>

      <section className="knowledge-rules-section">

        <div className="knowledge-section-heading">
          <div>
            <span className="knowledge-eyebrow">RULE LIBRARY</span>
            <h2>Diagnostic Rules</h2>
          </div>

          <span className="knowledge-total">
            {rules.length} rules
          </span>
        </div>

        {loading && (
          <div className="knowledge-message">
            Loading knowledge base...
          </div>
        )}

        {error && (
          <div className="knowledge-error">
            {error}
          </div>
        )}

        {!loading && !error && rules.length > 0 && (
          <div className="knowledge-rule-grid">
            {rules.map((rule, index) => (
              <div className="knowledge-rule-item" key={rule.id || index}>
                <div className="knowledge-rule-number">
                  RULE {String(index + 1).padStart(2, '0')}
                </div>

                <RuleCard rule={rule} />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && rules.length === 0 && (
          <div className="knowledge-message">
            <h3>No diagnostic rules found</h3>
            <p>
              The backend has not returned any knowledge-base rules yet.
            </p>
          </div>
        )}

      </section>

      <section className="knowledge-logic-panel">
        <div>
          <span className="knowledge-eyebrow">REASONING PRINCIPLE</span>
          <h2>How the knowledge engine works</h2>
          <p>
            HomeSense uses condition-based logical rules. When
            observed facts satisfy a rule's conditions, the
            inference engine derives a possible conclusion.
          </p>
        </div>

        <div className="knowledge-logic-example">
          <span>FACTS</span>
          <strong>Observed symptoms</strong>

          <div className="logic-arrow">↓</div>

          <span>RULE MATCHING</span>
          <strong>IF conditions are satisfied</strong>

          <div className="logic-arrow">↓</div>

          <span>CONCLUSION</span>
          <strong>Possible device fault</strong>
        </div>
      </section>

    </main>
  );
}
