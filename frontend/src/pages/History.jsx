
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { dateTime } from '../utils/formatters';

export default function History() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/diagnosis/history');

        if (active) {
          setRows(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.error ||
            'Unable to load diagnosis history. Please try again.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const matchesSearch =
        (item.device_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.fault || '').toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === 'All' || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [rows, search, filter]);

  return (
    <section className="hs-history-page">
      <div className="history-heading">
        <div>
          <span className="history-eyebrow">DIAGNOSTIC RECORDS</span>
          <h1>Diagnosis History</h1>
          <p>Review your previous smart-home fault diagnoses and AI reasoning.</p>
        </div>

        <div className="history-total">
          <strong>{rows.length}</strong>
          <span>Total diagnoses</span>
        </div>
      </div>

      <div className="history-stats">
        <div className="history-stat">
          <span>Total records</span>
          <strong>{rows.length}</strong>
        </div>

        <div className="history-stat">
          <span>Completed</span>
          <strong>
            {rows.filter((x) => x.status === 'Completed').length}
          </strong>
        </div>

        <div className="history-stat">
          <span>Other statuses</span>
          <strong>
            {rows.filter((x) => x.status !== 'Completed').length}
          </strong>
        </div>
      </div>

      <div className="history-panel">
        <div className="history-toolbar">
          <div>
            <h2>Previous diagnoses</h2>
            <p>Your saved diagnostic records</p>
          </div>

          <div className="history-filters">
            <input
              type="search"
              placeholder="Search device or fault..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="history-message">
            Loading diagnosis history...
          </div>
        )}

        {error && (
          <div className="history-error">
            {error}
          </div>
        )}

        {!loading && !error && filteredRows.length === 0 && (
          <div className="history-empty">
            <div className="history-empty-icon">⌕</div>
            <h3>
              {rows.length === 0
                ? 'No diagnosis records yet'
                : 'No matching records'}
            </h3>
            <p>
              {rows.length === 0
                ? 'Run a diagnosis to see your results here.'
                : 'Try changing your search or status filter.'}
            </p>
          </div>
        )}

        {!loading && !error && filteredRows.length > 0 && (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Device</th>
                  <th>Detected fault</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((item) => (
                  <>
                    <tr key={item.id}>
                      <td>{dateTime(item.created_at)}</td>
                      <td>{item.device_name}</td>
                      <td>{item.fault}</td>
                      <td>
                        <span className="history-status">
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="history-view-btn"
                          onClick={() =>
                            setExpanded(
                              expanded === item.id ? null : item.id
                            )
                          }
                        >
                          {expanded === item.id ? 'Close' : 'View'}
                        </button>
                      </td>
                    </tr>

                    {expanded === item.id && (
                      <tr key={`${item.id}-details`}>
                        <td colSpan="5">
                          <div className="history-details">
                            <h3>Diagnosis details</h3>

                            <div className="history-detail-grid">
                              <div>
                                <h4>Symptoms</h4>
                                {item.symptoms?.length ? (
                                  <ul>
                                    {item.symptoms.map((symptom, index) => (
                                      <li key={index}>{symptom}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>No symptoms recorded.</p>
                                )}
                              </div>

                              <div>
                                <h4>Explanation</h4>
                                <p>
                                  {item.explanation || 'No explanation available.'}
                                </p>
                              </div>

                              <div>
                                <h4>AI reasoning trace</h4>
                                {item.trace?.length ? (
                                  <ol>
                                    {item.trace.map((step, index) => (
                                      <li key={index}>{String(step)}</li>
                                    ))}
                                  </ol>
                                ) : (
                                  <p>No reasoning trace available.</p>
                                )}
                              </div>

                              <div>
                                <h4>Recommendations</h4>
                                {item.recommendations?.length ? (
                                  <ul>
                                    {item.recommendations.map((recommendation, index) => (
                                      <li key={index}>
                                        {String(recommendation)}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>No recommendations available.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
