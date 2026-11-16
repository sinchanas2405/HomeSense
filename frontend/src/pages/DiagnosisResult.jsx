
import { Link } from 'react-router-dom';
import InferenceTrace from '../components/InferenceTrace';

export default function DiagnosisResult() {
  let result = {};

  try {
    result = JSON.parse(
      sessionStorage.getItem('homesense_result') || '{}'
    );
  } catch (error) {
    result = {};
  }

  const recommendations = Array.isArray(result.recommendations)
    ? result.recommendations
    : [];

  const trace = Array.isArray(result.trace)
    ? result.trace
    : [];

  const hasResult = Object.keys(result).length > 0;

  return (
    <main className="hs-result-page">

      <div className="result-heading">
        <span className="result-eyebrow">
          HOMESENSE · INTELLIGENT DIAGNOSIS
        </span>

        <h1>Diagnosis Result</h1>

        <p>
          Review the identified fault and understand how the
          knowledge-based reasoning engine reached its conclusion.
        </p>
      </div>

      {!hasResult ? (
        <section className="panel result-empty">
          <h2>No diagnosis available</h2>
          <p>Run a diagnosis to see your results here.</p>

          <Link to="/diagnose" className="result-button">
            Start Diagnosis
          </Link>
        </section>
      ) : (
        <>
          <section className="panel result-main">
            <span className="result-eyebrow">
              DIAGNOSIS STATUS
            </span>

            <div className="result-status">
              {result.status || 'Completed'}
            </div>

            <h2>
              {result.fault || 'Fault information unavailable'}
            </h2>

            <p>
              {result.explanation || 'No explanation provided.'}
            </p>
          </section>

          <section className="panel result-section">
            <h2>Recommended Actions</h2>

            {recommendations.length > 0 ? (
              <ul className="result-recommendations">
                {recommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="result-muted">
                No recommendations available.
              </p>
            )}
          </section>

          <section className="panel result-section">
            <h2>Inference Trace</h2>

            <p className="result-muted">
              Reasoning steps returned by the diagnosis engine.
            </p>

            {trace.length > 0 ? (
              <InferenceTrace trace={trace} />
            ) : (
              <p className="result-muted">
                No inference trace available.
              </p>
            )}
          </section>
        </>
      )}

      <div className="result-actions">
        <Link to="/diagnose" className="result-button">
          Run Another Diagnosis
        </Link>

        <Link to="/devices" className="result-secondary">
          View Devices
        </Link>
      </div>

    </main>
  );
}
