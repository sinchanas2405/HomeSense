
import { useState } from "react";
import api from "../services/api";


const experimentInfo = [
  {
    name: "Power Failure",
    symptom: "Device is not powering on",
    icon: "⚡",
    expected: "R1 – Power supply or connection fault",
    color: "#fef3c7",
  },
  {
    name: "Network Issue",
    symptom: "Device frequently disconnects",
    icon: "📶",
    expected: "R2 – Wi-Fi or network instability",
    color: "#dbeafe",
  },
  {
    name: "Overheating",
    symptom: "Device becomes too hot",
    icon: "🌡️",
    expected: "R3 – Ventilation or thermal fault",
    color: "#fee2e2",
  },
  {
    name: "Unknown Symptom",
    symptom: "An unknown problem is reported",
    icon: "🔍",
    expected: "No matching rule",
    color: "#ede9fe",
  },
];

export default function Experiments() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runExperiments() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post("/experiments/run");
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Unable to run experiments. Please log in again and try."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="experiments-page">
      <div className="experiment-heading">
        <div>
          <span className="experiment-eyebrow">AI TESTING CENTER</span>
          <h1>Experiments</h1>
          <p>
            Test how accurately HomeSense identifies smart-home problems
            using its knowledge base and inference rules.
          </p>
        </div>

        <button
          className="run-all-btn"
          onClick={runExperiments}
          disabled={loading}
        >
          {loading ? "Running tests..." : "▶ Run All Experiments"}
        </button>
      </div>

      {error && <div className="experiment-error">{error}</div>}

      {result && (
        <div className="experiment-results">
          <h2>Benchmark Results</h2>

          <div className="experiment-stats">
            <div className="experiment-stat">
              <span>Total Tests</span>
              <strong>{result.total}</strong>
            </div>

            <div className="experiment-stat">
              <span>Passed</span>
              <strong className="passed-number">{result.passed}</strong>
            </div>

            <div className="experiment-stat">
              <span>Failed</span>
              <strong className="failed-number">
                {result.total - result.passed}
              </strong>
            </div>

            <div className="experiment-stat">
              <span>Accuracy</span>
              <strong>{result.accuracy_percent}%</strong>
            </div>
          </div>

          <div className="accuracy-track">
            <div
              className="accuracy-fill"
              style={{ width: `${result.accuracy_percent}%` }}
            />
          </div>

          <p className="accuracy-caption">
            {result.passed} out of {result.total} experiments passed.
          </p>
        </div>
      )}

      <div className="experiment-section-title">
        <div>
          <h2>Test Cases</h2>
          <p>Four predefined scenarios used to evaluate the AI system.</p>
        </div>
        <span className="case-count">4 EXPERIMENTS</span>
      </div>

      <div className="experiment-cards">
        {experimentInfo.map((item, index) => {
          const caseResult = result?.cases?.[index];

          return (
            <div className="experiment-card" key={item.name}>
              <div className="experiment-card-top">
                <div
                  className="experiment-icon"
                  style={{ background: item.color }}
                >
                  {item.icon}
                </div>

                {caseResult && (
                  <span
                    className={
                      caseResult.passed
                        ? "experiment-status success"
                        : "experiment-status failure"
                    }
                  >
                    {caseResult.passed ? "✓ Passed" : "✕ Failed"}
                  </span>
                )}

                {!caseResult && (
                  <span className="experiment-status pending">
                    Not Run
                  </span>
                )}
              </div>

              <span className="experiment-number">
                EXPERIMENT 0{index + 1}
              </span>

              <h3>{item.name}</h3>
              <p className="experiment-symptom">{item.symptom}</p>

              <div className="expected-result">
                <span>EXPECTED RESULT</span>
                <p>{item.expected}</p>
              </div>

              {caseResult && (
                <div className="actual-result">
                  <span>ACTUAL MATCHED RULES</span>

                  <p>
                    {caseResult.matched_rules?.length
                      ? caseResult.matched_rules.join(", ")
                      : "No rules matched"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="experiment-note">
        <span>💡</span>
        <p>
          <strong>How it works:</strong> HomeSense checks each symptom
          against the knowledge base, applies inference rules and compares
          the matched rules with the expected results.
        </p>
      </div>
    </div>
  );
}
