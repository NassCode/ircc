export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    credentials: 'same-origin',
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json', ...options.headers } : options.headers,
  });
  let body = {};
  try { body = await response.json(); } catch { /* Empty response. */ }
  if (!response.ok) throw new ApiError(body.error || 'The local service is unavailable.', response.status);
  return body;
}

export function formatDate(value) {
  if (!value) return 'Not provided';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}
