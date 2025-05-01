
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { User, checkAuth } from '@/services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: Partial<User> | null;
  username: string;
  password: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateLocalUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  // Check for stored credentials on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('journal_username');
    const storedPassword = localStorage.getItem('journal_password');
    
    if (storedUsername && storedPassword) {
      verifyAndSetAuth(storedUsername, storedPassword);
    }
  }, []);
  
  const verifyAndSetAuth = async (username: string, password: string) => {
    try {
      const isValid = await checkAuth(username, password);
      
      if (isValid) {
        setIsAuthenticated(true);
        setUsername(username);
        setPassword(password);
        return true;
      } else {
        clearAuthData();
        return false;
      }
    } catch {
      clearAuthData();
      return false;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const isValid = await checkAuth(username, password);
      
      if (isValid) {
        localStorage.setItem('journal_username', username);
        localStorage.setItem('journal_password', password);
        setIsAuthenticated(true);
        setUsername(username);
        setPassword(password);
        toast.success("Login successful");
        return true;
      } else {
        toast.error("Invalid credentials");
        return false;
      }
    } catch (error) {
      toast.error("Login failed");
      return false;
    }
  };

  const logout = () => {
    clearAuthData();
    toast.info("Logged out");
    navigate('/login');
  };
  
  const clearAuthData = () => {
    localStorage.removeItem('journal_username');
    localStorage.removeItem('journal_password');
    setIsAuthenticated(false);
    setUser(null);
    setUsername('');
    setPassword('');
  };
  
  const updateLocalUser = (updatedUser: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      username, 
      password, 
      login, 
      logout,
      updateLocalUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
