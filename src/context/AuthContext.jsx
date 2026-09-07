import { useState } from 'react';
import { AuthContext } from './AuthContextValue';

function getInitialAuth() {
  try {
    if (sessionStorage.getItem('ircc-session') === 'yes') {
      return {
        signedIn: true,
        user: { name: 'Alex Morgan', username: 'alex.morgan' },
      };
    }
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }

  return { signedIn: false, user: null };
}

export function AuthProvider({ children }) {
  const [{ signedIn, user }, setAuth] = useState(getInitialAuth);

  const login = (username, password) => {
    if (username === 'alex.morgan' && password === 'Alex2026!') {
      setAuth({
        signedIn: true,
        user: { name: 'Alex Morgan', username: 'alex.morgan' },
      });
      sessionStorage.setItem('ircc-session', 'yes');
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({ signedIn: false, user: null });
    sessionStorage.setItem('ircc-session', 'no');
  };

  return (
    <AuthContext.Provider value={{ signedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
