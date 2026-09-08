import { useState } from 'react';
import { AuthContext } from './AuthContextValue';

function getInitialAuth() {
  try {
    const user = JSON.parse(sessionStorage.getItem('ircc-user'));
    if (sessionStorage.getItem('ircc-session') === 'yes' && user) {
      return {
        signedIn: true,
        user,
      };
    }
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }

  return { signedIn: false, user: null };
}

export function AuthProvider({ children }) {
  const [{ signedIn, user }, setAuth] = useState(getInitialAuth);

  const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) return false;

    const { user: authenticatedUser } = await response.json();
    setAuth({ signedIn: true, user: authenticatedUser });
    sessionStorage.setItem('ircc-session', 'yes');
    sessionStorage.setItem('ircc-user', JSON.stringify(authenticatedUser));
    return true;
  };

  const logout = () => {
    setAuth({ signedIn: false, user: null });
    sessionStorage.setItem('ircc-session', 'no');
    sessionStorage.removeItem('ircc-user');
  };

  return (
    <AuthContext.Provider value={{ signedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
