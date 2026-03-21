import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('irms_token');
    const user = localStorage.getItem('irms_user');
    return token ? { token, user: JSON.parse(user) } : null;
  });

  function login(token, user) {
    localStorage.setItem('irms_token', token);
    localStorage.setItem('irms_user', JSON.stringify(user));
    setAuth({ token, user });
  }

  function logout() {
    localStorage.removeItem('irms_token');
    localStorage.removeItem('irms_user');
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
