const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

let token = '';

export function setToken(newToken: string) {
  token = newToken;
}

async function request(path: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error((await res.json()).message || 'API error');
  return res.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, data?: any) => request(path, { method: 'POST', body: JSON.stringify(data) }),
};
