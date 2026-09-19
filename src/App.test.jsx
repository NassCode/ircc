import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const applicant = {
  id: 'applicant-1', role: 'applicant', username: 'jamie.lee', active: true,
  profile: { fullName: 'Jamie Lee', dateOfBirth: '1991-03-04', email: 'jamie@example.com', preferredLanguage: 'English', countryOfResidence: 'Georgia', passportLastFour: '4321' },
  application: {
    type: 'Work permit', number: 'W-100', uci: '1000-2000', purpose: 'Employment', submittedAt: '2026-09-01', status: 'Review in progress', lastUpdatedAt: '2026-09-19',
    stages: [{ id: 'stage-1', label: 'Application submitted', state: 'complete', date: 'September 1, 2026', detail: 'Received.' }],
    documentRequests: [], providedDocuments: [], messages: [],
  },
};

function response(body, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }));
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.replaceState({}, '', '/');
});

describe('role routing and database-backed applicant views', () => {
  it('redirects an applicant away from admin and renders assigned application data', async () => {
    window.history.replaceState({}, '', '/admin');
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (url === '/api/session') return response({ user: { id: applicant.id, username: applicant.username, name: applicant.profile.fullName, role: 'applicant', active: true } });
      if (url === '/api/me') return response({ applicant });
      return response({ error: 'Not found' }, 404);
    }));
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Welcome back, Jamie Lee' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Work permit' })).toBeTruthy();
    expect(window.location.pathname).toBe('/dashboard');
  });

  it('renders the admin control panel for an administrator', async () => {
    window.history.replaceState({}, '', '/admin');
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (url === '/api/session') return response({ user: { id: 'admin-1', username: 'admin', name: 'Portal administrator', role: 'admin', active: true } });
      if (String(url).startsWith('/api/admin/users')) return response({ applicants: [] });
      return response({ error: 'Not found' }, 404);
    }));
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Applicants' })).toBeTruthy();
    expect(await screen.findByRole('heading', { name: 'No applicants found' })).toBeTruthy();
  });
});
