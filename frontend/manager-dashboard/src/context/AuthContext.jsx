import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('irms_token') || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('irms_user');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(username, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Sai tên đăng nhập hoặc mật khẩu');
    }
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('irms_token', data.token);
    localStorage.setItem('irms_user', JSON.stringify(data.user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('irms_token');
    localStorage.removeItem('irms_user');
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
