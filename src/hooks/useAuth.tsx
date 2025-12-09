import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Manager } from '@/types';

interface AuthContextType {
  manager: Manager | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_MANAGER: Manager = {
  id: '1',
  email: 'admin@mall.com',
  name: 'Mall Manager',
};

const DEMO_PASSWORD = 'password123';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [manager, setManager] = useState<Manager | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('manager');
    if (stored) {
      setManager(JSON.parse(stored));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === DEMO_MANAGER.email && password === DEMO_PASSWORD) {
      setManager(DEMO_MANAGER);
      localStorage.setItem('manager', JSON.stringify(DEMO_MANAGER));
      return true;
    }
    return false;
  };

  const logout = () => {
    setManager(null);
    localStorage.removeItem('manager');
  };

  return (
    <AuthContext.Provider value={{ manager, isAuthenticated: !!manager, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
