const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// All requests include credentials so httpOnly cookie (JWT) is sent and received.
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include',
    ...options
  });

  const contentType = res.headers.get('content-type') || '';
  let body = null;
  if (contentType.includes('application/json')) body = await res.json();
  else body = await res.text();

  if (!res.ok) {
    // Try extract structured errors
    if (body && body.errors) {
      const msg = body.errors.map(e => e.msg).join(' | ');
      const err = new Error(msg);
      err.body = body;
      throw err;
    } else {
      const err = new Error(body || 'Request failed');
      err.body = body;
      throw err;
    }
  }

  return body;
}

export const signup = (name, email, password) =>
  request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });

export const login = (email, password) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

export const logout = () =>
  request('/api/auth/logout', {
    method: 'POST'
  });

export const me = () =>
  request('/api/auth/me', {
    method: 'GET'
  });