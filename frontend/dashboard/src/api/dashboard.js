const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include',
    ...options
  });

  const ct = res.headers.get('content-type') || '';
  let body = null;
  if (ct.includes('application/json')) body = await res.json();
  else body = await res.text();

  if (!res.ok) {
    if (body && body.errors) {
      const msg = body.errors.map(e => e.msg).join(' | ');
      const err = new Error(msg);
      err.body = body;
      throw err;
    }
    const err = new Error(body || 'Request failed');
    err.body = body;
    throw err;
  }
  return body;
}

export const createSession = (durationMinutes, focusedPercent, date) =>
  request('/api/dashboard/session', {
    method: 'POST',
    body: JSON.stringify({ durationMinutes, focusedPercent, date })
  });

export const getAnalytics = (days = 30) =>
  request(`/api/dashboard/analytics?days=${days}`, {
    method: 'GET'
  });

export const getAdminOverview = () =>
  request('/api/dashboard/admin/overview', { method: 'GET' });