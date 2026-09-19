import { useEffect, useState } from 'react';
import { api } from '../api';
import { AuthContext } from './AuthContextValue';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/session').then(({ user: sessionUser }) => setUser(sessionUser)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const { user: authenticatedUser } = await api('/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const logout = async () => {
    try { await api('/logout', { method: 'POST' }); } finally { setUser(null); }
  };

  return <AuthContext.Provider value={{ signedIn: Boolean(user), user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
