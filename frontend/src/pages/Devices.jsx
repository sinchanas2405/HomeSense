
import { useEffect, useState } from 'react';
import api from '../services/api';
import DeviceCard from '../components/DeviceCard';

const deviceTypes = [
  'Smart plug',
  'Air conditioner',
  'Refrigerator',
  'Washing machine',
  'Router',
  'Smart light',
  'Other'
];

export default function Devices() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Smart plug');
  const [room, setRoom] = useState('Living room');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  async function loadDevices() {
    try {
      setError('');
      const response = await api.get('/devices');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Unable to load devices. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter a device name.');
      return;
    }

    try {
      setAdding(true);
      setError('');

      await api.post('/devices', {
        name: name.trim(),
        device_type: type,
        room: room.trim()
      });

      setName('');
      setRoom('Living room');

      await loadDevices();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not add the device. Please try again.'
      );
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    try {
      setError('');
      await api.delete(`/devices/${id}`);
      await loadDevices();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not delete this device.'
      );
    }
  }

  const onlineCount = items.filter(device =>
    ['active', 'online'].includes(
      String(device.status || '').toLowerCase()
    )
  ).length;

  return (
    <div className="hs-devices-page">

      <section className="devices-heading">
        <div>
          <span className="hs-eyebrow">HOMESENSE MANAGEMENT</span>
          <h1>My Devices</h1>
          <p>
            Manage your connected smart-home devices and monitor
            their registration status.
          </p>
        </div>

        <div className="devices-heading-icon">⌂</div>
      </section>

      <section className="device-stat-grid">
        <article className="device-stat-card">
          <span>Total devices</span>
          <strong>{loading ? '—' : items.length}</strong>
          <small>Registered in your account</small>
        </article>

        <article className="device-stat-card">
          <span>Online devices</span>
          <strong>{loading ? '—' : onlineCount}</strong>
          <small>Currently marked online</small>
        </article>

        <article className="device-stat-card">
          <span>Other devices</span>
          <strong>{loading ? '—' : items.length - onlineCount}</strong>
          <small>Offline or other status</small>
        </article>
      </section>

      <section className="devices-form-panel">
        <div className="devices-panel-heading">
          <div>
            <span className="hs-eyebrow">DEVICE REGISTRATION</span>
            <h2>Add a new device</h2>
          </div>
          <span className="devices-add-icon">＋</span>
        </div>

        <form className="devices-form" onSubmit={handleAdd}>
          <div className="devices-field">
            <label htmlFor="device-name">Device name</label>
            <input
              id="device-name"
              type="text"
              placeholder="Example: Living room smart light"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="devices-field">
            <label htmlFor="device-type">Device type</label>
            <select
              id="device-type"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              {deviceTypes.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="devices-field">
            <label htmlFor="device-room">Room</label>
            <input
              id="device-room"
              type="text"
              placeholder="Example: Bedroom"
              value={room}
              onChange={e => setRoom(e.target.value)}
            />
          </div>

          <button
            className="devices-submit"
            type="submit"
            disabled={adding}
          >
            {adding ? 'Adding device...' : '+ Add device'}
          </button>
        </form>
      </section>

      {error && (
        <div className="hs-error">
          {error}
        </div>
      )}

      <section className="devices-list-section">
        <div className="devices-list-heading">
          <div>
            <span className="hs-eyebrow">YOUR SMART HOME</span>
            <h2>Registered devices</h2>
          </div>

          <span className="devices-total">
            {loading ? 'Loading...' : `${items.length} devices`}
          </span>
        </div>

        {loading ? (
          <div className="devices-empty">
            Loading your devices...
          </div>
        ) : items.length > 0 ? (
          <div className="devices-card-grid">
            {items.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="devices-empty">
            <span className="devices-empty-icon">⌂</span>
            <h3>No devices registered yet</h3>
            <p>
              Add your first smart-home device using the form above.
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
