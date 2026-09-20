import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const applicant = {
  id: 'applicant-1', role: 'applicant', username: 'jamie.lee', active: true,
  profile: { fullName: 'Jamie Lee', dateOfBirth: '1991-03-04', email: 'jamie@example.com', preferredLanguage: 'English', countryOfResidence: 'Georgia', passportLastFour: '4321' },
  application: {
    type: 'Sponsorship', number: 'SP-100', uci: '1000-2000', purpose: 'Family reunification', submittedAt: '2026-09-01', status: 'Review in progress', lastUpdatedAt: '2026-09-19',
    details: { personFullName: 'Morgan Lee', relationship: 'Spouse', dateOfBirth: '1990-02-03', citizenship: 'Canadian',
      countryOfResidence: 'Canada', passportNumber: 'CA123456', passportExpiry: '2030-04-05', sponsorshipCategory: 'Spouse or partner', maritalStatus: 'Married', dependants: 1 },
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
    expect(screen.getByRole('heading', { name: 'Sponsorship' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Sponsored person details' })).toBeTruthy();
    expect(screen.getByText('Morgan Lee')).toBeTruthy();
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

  it('shows the logical fields for each structured application type', async () => {
    window.history.replaceState({}, '', '/admin/users/new');
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (url === '/api/session') return response({ user: { id: 'admin-1', username: 'admin', name: 'Portal administrator', role: 'admin', active: true } });
      return response({ error: 'Not found' }, 404);
    }));
    render(<App />);
    const assignedApplication = await screen.findByText('Assigned application');
    expect(assignedApplication.closest('details').open).toBe(false);
    fireEvent.click(assignedApplication);
    expect(assignedApplication.closest('details').open).toBe(true);
    const typeInput = await screen.findByLabelText('Application type');
    fireEvent.change(typeInput, { target: { value: 'Invitation' } });
    expect(screen.getByRole('heading', { name: 'Invited person and travel details' })).toBeTruthy();
    expect(screen.getByLabelText('Passport number *')).toBeTruthy();
    fireEvent.change(typeInput, { target: { value: 'Work and labour' } });
    expect(screen.getByRole('heading', { name: 'Employment details' })).toBeTruthy();
    expect(screen.getByLabelText('Employer or organization *')).toBeTruthy();
  });
});
