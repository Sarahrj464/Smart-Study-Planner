import React, { useEffect, useState, useContext } from 'react';
import * as api from '../api/dashboard';
import { MinutesLineChart, FocusBarChart } from './Charts';
import { AuthContext } from '../../../auth/src/context/AuthContext'; // path depends on your setup

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [adminOverview, setAdminOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchData();
    if (user?.role === 'admin') fetchAdminOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, days]);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAnalytics(days);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdminOverview() {
    try {
      const res = await api.getAdminOverview();
      setAdminOverview(res);
    } catch (err) {
      // ignore / show error
      console.error('admin overview error', err);
    }
  }

  // Quick helper to add a dummy session (useful in dev)
  async function addDummySession() {
    setAdding(true);
    try {
      // 45 minutes, 80% focused
      await api.createSession(45, 80);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to add session');
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <div className="card">Loading dashboard...</div>;
  if (error) return <div className="card error">{error}</div>;

  const summary = data?.summary || {};
  const daily = data?.daily || [];

  return (
    <div className="card">
      <h2>Productivity Dashboard</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Total study hours</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{summary.totalHours ?? 0} hrs</div>
        </div>
        <div style={{ flex: 1, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Avg focus</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{summary.avgFocus ?? 0}%</div>
        </div>
        <div style={{ flex: 1, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Current streak</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{summary.currentStreak ?? 0} days</div>
        </div>
      </div>

      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <label>Range (days): </label>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
          <option value={7}>7</option>
          <option value={14}>14</option>
          <option value={30}>30</option>
          <option value={90}>90</option>
        </select>

        <button className="button secondary" onClick={addDummySession} disabled={adding}>
          {adding ? 'Adding...' : 'Add dummy session'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h4>Study minutes (daily)</h4>
          <MinutesLineChart daily={daily} />
        </div>
        <div>
          <h4>Focus % (daily)</h4>
          <FocusBarChart daily={daily} />
        </div>
      </div>

      {user?.role === 'admin' && (
        <div style={{ marginTop: 18 }}>
          <h3>Admin overview</h3>
          {adminOverview ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ padding: 12, background: '#fff', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Total users</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{adminOverview.totalUsers}</div>
              </div>
              <div style={{ padding: 12, background: '#fff', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Total hours</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{adminOverview.totalHours}</div>
              </div>
              <div style={{ padding: 12, background: '#fff', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Avg focus</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{adminOverview.avgFocus}%</div>
              </div>
            </div>
          ) : (
            <div>Loading admin overview...</div>
          )}
        </div>
      )}
    </div>
  );
}