import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, getMe } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('jiva_user');
    const token = localStorage.getItem('jiva_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginService(email, password);
      if (res.success) {
        localStorage.setItem('jiva_token', res.data.token);
        localStorage.setItem('jiva_user', JSON.stringify(res.data));
        setUser(res.data);
        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('jiva_token');
    localStorage.removeItem('jiva_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUserState = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
    localStorage.setItem('jiva_user', JSON.stringify({ ...user, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
