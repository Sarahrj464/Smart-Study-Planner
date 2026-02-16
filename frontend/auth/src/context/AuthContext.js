import React, { createContext, useEffect, useState } from 'react';
import * as api from '../api/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const res = await api.me();
      setUser(res.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    reloadUser: loadUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}