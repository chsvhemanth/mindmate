import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, userAPI } from '@/utils/api';
import { toast } from 'sonner';

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  authProvider?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await userAPI.login(email, password);
      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    try {
      const response = await userAPI.register(userData);
      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Account created successfully!');
        return response;
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const googleLogin = async (googleToken: string) => {
    try {
      console.log('[Auth] Attempting Google login...');
      const response = await authAPI.googleLogin(googleToken);
      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('[Auth] Google login successful');
        toast.success('Welcome to MindMate!');
      } else {
        throw new Error(response.message || 'Google login failed: Invalid response');
      }
    } catch (error: any) {
      console.error('[Auth] Google login error:', error);
      const errorMessage = error.message || 'Google login failed';
      
      // Provide more specific error messages
      if (errorMessage.includes('Failed to connect') || errorMessage.includes('fetch')) {
        toast.error('Cannot connect to server. Please make sure the backend is running.');
      } else if (errorMessage.includes('CORS')) {
        toast.error('CORS error: Backend configuration issue. Please check server settings.');
      } else {
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        googleLogin,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
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

