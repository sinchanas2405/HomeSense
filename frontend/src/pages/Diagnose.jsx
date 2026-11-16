
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const symptomsList = [
  { id: 'device_not_powering', title: 'Device not powering on', icon: '⏻', description: 'Device does not turn on or respond.' },
  { id: 'frequent_disconnects', title: 'Frequent disconnections', icon: '⌁', description: 'Device repeatedly loses connection.' },
  { id: 'overheating', title: 'Overheating', icon: '♨', description: 'Device becomes unusually hot.' },
  { id: 'unusual_noise', title: 'Unusual noise', icon: '♫', description: 'Device produces unexpected sounds.' },
  { id: 'poor_performance', title: 'Poor performance', icon: '◷', description: 'Device responds slowly or incorrectly.' },
  { id: 'indicator_light_error', title: 'Indicator light error', icon: '◉', description: 'Warning light or unusual indicator appears.' }
];

export default function Diagnose() {
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function loadDevices() {
      try {
        const response = await api.get('/devices');
        const list = Array.isArray(response.data) ? response.data : [];

        setDevices(list);

        if (list.length > 0) {
          setDeviceId(String(list[0].id));
        }
      } catch (err) {
        setError(
          err.response?.data?.error ||
          'Could not load your devices. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadDevices();
  }, []);

  function toggleSymptom(id) {
    setSymptoms(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!deviceId || symptoms.length === 0) {
      setError('Please select a device and at least one symptom.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await api.post('/diagnosis', {
        device_id: Number(deviceId),
        symptoms,
        notes: notes.trim()
      });

      sessionStorage.setItem(
        'homesense_result',
        JSON.stringify(response.data)
      );

      navigate('/result');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Diagnosis failed. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  const selectedDevice = devices.find(
    device => String(device.id) === deviceId
  );

  return (
    <div className="hs-diagnosis-page">

      <section className="diagnosis-hero">
        <div>
          <span className="hs-eyebrow">HOMESENSE INTELLIGENCE ENGINE</span>
          <h1>Smart device<br /><span>diagnosis.</span></h1>
          <p>
            Describe what your smart device is experiencing.
            Our knowledge-based reasoning engine evaluates symptoms
            against facts and rules to identify possible faults.
          </p>
        </div>

        <div className="diagnosis-hero-icon">
          <span>✧</span>
          <small>AI REASONING</small>
          <strong>ENGINE ACTIVE</strong>
        </div>
      </section>

      {error && (
        <div className="hs-error">{error}</div>
      )}

      <form className="diagnosis-workspace" onSubmit={handleSubmit}>

        <section className="diagnosis-form-panel">

          <div className="diagnosis-step">
            <span>01</span>
            <div>
              <h2>Select your device</h2>
              <p>Choose the device you want to investigate.</p>
            </div>
          </div>

          <label className="diagnosis-label" htmlFor="diagnosis-device">
            REGISTERED DEVICE
          </label>

          <select
            id="diagnosis-device"
            className="diagnosis-select"
            value={deviceId}
            onChange={e => setDeviceId(e.target.value)}
            disabled={loading || devices.length === 0}
            required
          >
            <option value="">
              {loading ? 'Loading devices...' : 'Select a device'}
            </option>

            {devices.map(device => (
              <option key={device.id} value={device.id}>
                {device.name} — {device.device_type}
              </option>
            ))}
          </select>

          {selectedDevice && (
            <div className="diagnosis-device-info">
              <span className="diagnosis-device-symbol">⌂</span>
              <div>
                <strong>{selectedDevice.name}</strong>
                <small>
                  {selectedDevice.device_type} · {selectedDevice.room || 'Room not specified'}
                </small>
              </div>
              <span className="diagnosis-selected">SELECTED</span>
            </div>
          )}

          {!loading && devices.length === 0 && (
            <div className="diagnosis-no-device">
              <p>No registered devices found.</p>
              <a href="/devices">Register a device first →</a>
            </div>
          )}

          <div className="diagnosis-divider" />

          <div className="diagnosis-step">
            <span>02</span>
            <div>
              <h2>Identify the symptoms</h2>
              <p>Select every issue you have observed.</p>
            </div>
          </div>

          <div className="diagnosis-symptoms">
            {symptomsList.map(item => {
              const selected = symptoms.includes(item.id);

              return (
                <label
                  key={item.id}
                  className={`symptom-card ${selected ? 'symptom-selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleSymptom(item.id)}
                  />

                  <span className="symptom-icon">{item.icon}</span>

                  <span className="symptom-content">
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>

                  <span className="symptom-check">
                    {selected ? '✓' : '+'}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="symptom-selection-count">
            {symptoms.length} symptom{symptoms.length !== 1 ? 's' : ''} selected
          </div>

          <div className="diagnosis-divider" />

          <div className="diagnosis-step">
            <span>03</span>
            <div>
              <h2>Additional information</h2>
              <p>Provide any other details that may help the diagnosis.</p>
            </div>
          </div>

          <label className="diagnosis-label" htmlFor="diagnosis-notes">
            ADDITIONAL NOTES (OPTIONAL)
          </label>

          <textarea
            id="diagnosis-notes"
            className="diagnosis-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            placeholder="Describe when the problem started, what happened, or any other observations..."
          />

          <button
            className="diagnosis-submit"
            type="submit"
            disabled={loading || submitting || !deviceId || symptoms.length === 0}
          >
            {submitting ? 'Analyzing symptoms...' : '✧  Run AI diagnosis'}
            {!submitting && <span>→</span>}
          </button>

          <p className="diagnosis-security-note">
            ✦ Symptoms are evaluated using the HomeSense knowledge base
            and its available reasoning rules.
          </p>

        </section>

        <aside className="diagnosis-side-panel">

          <div className="reasoning-card">
            <span className="hs-eyebrow">HOW IT WORKS</span>
            <h3>Intelligent reasoning process</h3>

            <div className="reasoning-step">
              <span>01</span>
              <div>
                <strong>Input symptoms</strong>
                <small>Collect observed device problems</small>
              </div>
            </div>

            <div className="reasoning-line" />

            <div className="reasoning-step">
              <span>02</span>
              <div>
                <strong>Knowledge matching</strong>
                <small>Compare symptoms with stored facts and rules</small>
              </div>
            </div>

            <div className="reasoning-line" />

            <div className="reasoning-step">
              <span>03</span>
              <div>
                <strong>Inference</strong>
                <small>Apply reasoning patterns to identify faults</small>
              </div>
            </div>

            <div className="reasoning-line" />

            <div className="reasoning-step">
              <span>04</span>
              <div>
                <strong>Diagnosis result</strong>
                <small>Display conclusions and supporting explanations</small>
              </div>
            </div>
          </div>

          <div className="diagnosis-tip-card">
            <span>✦</span>
            <h3>For better results</h3>
            <p>
              Select all symptoms you have actually observed.
              Accurate information helps the reasoning engine
              evaluate possible faults.
            </p>
          </div>

          <div className="diagnosis-warning">
            <strong>Safety reminder</strong>
            <p>
              Do not open electrical devices or touch exposed wiring.
              Follow manufacturer safety instructions.
            </p>
          </div>

        </aside>

      </form>
    </div>
  );
}
