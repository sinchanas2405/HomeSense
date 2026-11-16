
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';


const energyData = [
  { day: 'MON', value: 45 },
  { day: 'TUE', value: 65 },
  { day: 'WED', value: 52 },
  { day: 'THU', value: 78 },
  { day: 'FRI', value: 60 },
  { day: 'SAT', value: 88 },
  { day: 'SUN', value: 72 }
];

function HouseVisual() {
  return (
    <div className="house-visual">
      <div className="house-glow" />
      <div className="house-orbit orbit-a" />
      <div className="house-orbit orbit-b" />

      <svg viewBox="0 0 520 350" className="house-svg">
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#314d68" />
            <stop offset="100%" stopColor="#172a42" />
          </linearGradient>
          <linearGradient id="roof" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6585a6" />
            <stop offset="100%" stopColor="#263c58" />
          </linearGradient>
          <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#77e9d1" />
            <stop offset="100%" stopColor="#278b91" />
          </linearGradient>
          <filter id="houseShadow">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <ellipse cx="260" cy="302" rx="175" ry="20"
          fill="#35d9b0" opacity=".16" filter="url(#houseShadow)" />

        <path d="M105 153 L258 55 L415 153 L415 280 L105 280Z"
          fill="url(#wall)" stroke="#7896b2" strokeWidth="2" />

        <path d="M75 157 L258 35 L445 157 L415 174 L258 73 L105 174Z"
          fill="url(#roof)" stroke="#88a5bf" strokeWidth="2" />

        <path d="M258 73 L415 174 L415 280 L258 280Z"
          fill="#213750" opacity=".8" />

        <path d="M258 73 L258 280" stroke="#7896b2"
          strokeWidth="2" opacity=".5" />

        <rect x="139" y="177" width="68" height="75" rx="4"
          fill="url(#window)" stroke="#9cf4e2" strokeWidth="2" />
        <path d="M173 177 V252 M139 215 H207"
          stroke="#18394a" strokeWidth="3" />

        <rect x="294" y="177" width="72" height="72" rx="4"
          fill="url(#window)" stroke="#9cf4e2" strokeWidth="2" />
        <path d="M330 177 V249 M294 213 H366"
          stroke="#18394a" strokeWidth="3" />

        <rect x="222" y="206" width="48" height="74" rx="3"
          fill="#101f32" stroke="#8ca8c3" strokeWidth="2" />
        <circle cx="258" cy="244" r="3" fill="#5de2c0" />

        <path d="M110 280 H416" stroke="#8ca8c3" strokeWidth="3" />
        <path d="M75 300 H445" stroke="#3ed6b0" strokeWidth="2" opacity=".4" />
      </svg>

      <div className="house-status status-top">
        <span className="status-dot" /> Smart home online
      </div>
      <div className="house-status status-left">
        <span>☼</span> Lighting active
      </div>
      <div className="house-status status-right">
        <span>⌁</span> Climate connected
      </div>
      <div className="house-status status-bottom">
        <span>◉</span> Network stable
      </div>
    </div>
  );
}

function EnergyChart() {
  const points = energyData.map((item, i) => {
    const x = 15 + i * 65;
    const y = 150 - item.value * 1.25;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="energy-chart">
      <div className="chart-labels">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
        <span>0</span>
      </div>
      <div className="chart-content">
        <div className="chart-lines">
          {[0, 1, 2, 3, 4].map(x => <i key={x} />)}
        </div>
        <svg viewBox="0 0 420 165" preserveAspectRatio="none">
          <defs>
            <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#44d8b1" stopOpacity=".35" />
              <stop offset="100%" stopColor="#44d8b1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`15,165 ${points} 405,165`}
            fill="url(#energyFill)" />
          <polyline points={points} fill="none" stroke="#44d8b1"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {energyData.map((item, i) => (
            <circle key={item.day}
              cx={15 + i * 65}
              cy={150 - item.value * 1.25}
              r="3.5" fill="#44d8b1" stroke="#142d38" strokeWidth="2" />
          ))}
        </svg>
        <div className="chart-days">
          {energyData.map(item => <span key={item.day}>{item.day}</span>)}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, icon, detail, accent }) {
  return (
    <article className="hs-metric">
      <div className={`metric-icon ${accent}`}>{icon}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail">{detail}</div>
    </article>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({});
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [dashboardResponse, deviceResponse] = await Promise.all([
          api.get('/dashboard'),
          api.get('/devices')
        ]);

        if (active) {
          setData(dashboardResponse.data || {});
          setDevices(Array.isArray(deviceResponse.data)
            ? deviceResponse.data : []);
        }
      } catch (err) {
        if (active) {
          setError('Could not load your home information. Please check your connection and sign in again if needed.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => { active = false; };
  }, []);

  const online = devices.filter(d =>
    ['active', 'online'].includes(String(d.status).toLowerCase())
  ).length;

  const diagnoses = data.diagnosis_count ?? 0;
  const rules = data.rule_count ?? 0;

  return (
    <div className="hs-dashboard">
      <section className="hs-welcome">
        <div>
          <div className="hs-eyebrow">
            <span className="status-dot" /> HOMESENSE INTELLIGENCE SYSTEM
          </div>
          <h1>Your home.<br /><span>Under control.</span></h1>
          <p>
            Monitor your connected devices, understand your home's health
            and identify potential problems with intelligent diagnosis.
          </p>
          <div className="welcome-actions">
            <Link to="/devices" className="hs-button hs-primary">
              Explore devices <span>↗</span>
            </Link>
            <Link to="/diagnose" className="hs-button hs-secondary">
              Start diagnosis
            </Link>
          </div>
        </div>
        <HouseVisual />
        <div className="welcome-decoration">H</div>
      </section>

      {error && <div className="hs-error">{error}</div>}

      <section className="hs-section">
        <div className="hs-section-heading">
          <div>
            <span className="hs-eyebrow">SYSTEM OVERVIEW</span>
            <h2>Your home at a glance</h2>
          </div>
          <span className="hs-live"><i /> {loading ? 'LOADING' : 'CONNECTED'}</span>
        </div>

        <div className="hs-metrics">
          <Metric label="REGISTERED DEVICES"
            value={loading ? '—' : devices.length}
            icon="▣" detail="Devices in your account" accent="mint" />
          <Metric label="ONLINE DEVICES"
            value={loading ? '—' : online}
            icon="⌁" detail="Based on saved device status" accent="blue" />
          <Metric label="AI DIAGNOSES"
            value={loading ? '—' : diagnoses}
            icon="✧" detail="Diagnoses completed" accent="purple" />
          <Metric label="KNOWLEDGE RULES"
            value={loading ? '—' : rules}
            icon="◈" detail="Available reasoning rules" accent="orange" />
        </div>
      </section>

      <div className="hs-main-grid">
        <section className="hs-panel energy-panel">
          <div className="hs-panel-heading">
            <div>
              <span className="hs-eyebrow">ENERGY MONITORING</span>
              <h3>Weekly energy pattern</h3>
            </div>
            <span className="hs-tag">ILLUSTRATIVE DATA</span>
          </div>
          <div className="energy-summary">
            <div>
              <span className="energy-number">—</span>
              <span className="energy-unit"> kWh</span>
              <p>Live energy readings are not connected yet</p>
            </div>
            <span className="energy-symbol">ϟ</span>
          </div>
          <EnergyChart />
          <p className="hs-chart-note">
            Example chart layout. Connect energy sensors to display actual readings.
          </p>
        </section>

        <section className="hs-panel device-panel">
          <div className="hs-panel-heading">
            <div>
              <span className="hs-eyebrow">CONNECTED HARDWARE</span>
              <h3>Device overview</h3>
            </div>
            <Link to="/devices" className="hs-text-link">Manage ↗</Link>
          </div>

          <div className="device-count-circle">
            <div>
              <strong>{loading ? '—' : devices.length}</strong>
              <small>DEVICES</small>
            </div>
          </div>

          <div className="device-legend">
            <div><i className="legend-online" /> Active <b>{online}</b></div>
            <div><i className="legend-offline" /> Other status <b>{devices.length - online}</b></div>
          </div>

          <Link to="/devices" className="hs-outline-link">
            View all devices <span>→</span>
          </Link>
        </section>
      </div>

      <div className="hs-main-grid hs-bottom-grid">
        <section className="hs-panel">
          <div className="hs-panel-heading">
            <div>
              <span className="hs-eyebrow">YOUR NETWORK</span>
              <h3>Registered devices</h3>
            </div>
            <Link to="/devices" className="hs-text-link">View all ↗</Link>
          </div>

          {loading ? (
            <p className="hs-empty">Loading devices...</p>
          ) : devices.length ? (
            <div className="hs-device-list">
              {devices.slice(0, 4).map(device => (
                <div className="hs-device-row" key={device.id}>
                  <div className="hs-device-icon">⌂</div>
                  <div className="hs-device-info">
                    <b>{device.name}</b>
                    <small>{device.device_type} · {device.room || 'Room not set'}</small>
                  </div>
                  <span className={
                    ['active', 'online'].includes(String(device.status).toLowerCase())
                      ? 'hs-device-state active-state'
                      : 'hs-device-state'
                  }>
                    {device.status || 'Unknown'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="hs-empty">
              <span>⌂</span>
              <b>No devices registered</b>
              <p>Add your first smart device to begin monitoring your home.</p>
              <Link to="/devices" className="hs-text-link">Add a device →</Link>
            </div>
          )}
        </section>

        <section className="hs-panel quick-panel-new">
          <div className="hs-panel-heading">
            <div>
              <span className="hs-eyebrow">WORKSPACE</span>
              <h3>Quick actions</h3>
            </div>
          </div>

          <Link to="/devices" className="hs-quick-action">
            <span className="quick-icon mint">▣</span>
            <span><b>Manage devices</b><small>Add or remove devices</small></span>
            <i>↗</i>
          </Link>
          <Link to="/diagnose" className="hs-quick-action">
            <span className="quick-icon purple">✧</span>
            <span><b>AI diagnosis</b><small>Investigate device symptoms</small></span>
            <i>↗</i>
          </Link>
          <Link to="/knowledge" className="hs-quick-action">
            <span className="quick-icon blue">◈</span>
            <span><b>Knowledge base</b><small>Explore facts and rules</small></span>
            <i>↗</i>
          </Link>
          <Link to="/visualization" className="hs-quick-action">
            <span className="quick-icon orange">⌘</span>
            <span><b>AI visualization</b><small>Explore the reasoning process</small></span>
            <i>↗</i>
          </Link>
        </section>
      </div>

      <div className="hs-footer-note">
        <span>✦</span>
        HomeSense AI helps you understand device symptoms through
        knowledge-based reasoning. Always follow manufacturer safety guidance.
      </div>
    </div>
  );
}
