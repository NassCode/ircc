import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from './useAuth';
import { DataContext } from './DataContextValue';

export function DataProvider({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (user?.role !== 'applicant') { setApplicant(null); return; }
    setLoading(true); setError('');
    try { setApplicant((await api('/me')).applicant); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [user]);

  // Fetching on route changes intentionally refreshes server-owned applicant data.
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { refresh(); }, [refresh, location.pathname]);

  const markRead = async (id) => {
    await api(`/me/messages/${id}/read`, { method: 'PATCH' });
    setApplicant((current) => ({ ...current, application: { ...current.application,
      messages: current.application.messages.map((message) => message.id === id ? { ...message, readAt: message.readAt || new Date().toISOString() } : message) } }));
  };

  const attachDocument = async (requestId, file) => {
    await api(`/me/document-requests/${requestId}/upload`, { method: 'PUT',
      body: JSON.stringify({ name: file.name, type: file.type, size: file.size }) });
    await refresh();
  };

  const removeDocument = async (requestId) => {
    await api(`/me/document-requests/${requestId}/upload`, { method: 'DELETE' });
    await refresh();
  };

  return <DataContext.Provider value={{ applicant, application: applicant?.application || null,
    messages: applicant?.application?.messages || [], loading, error, refresh, markRead, attachDocument, removeDocument }}>{children}</DataContext.Provider>;
}
