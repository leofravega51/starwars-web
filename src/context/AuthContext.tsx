import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { apiService } from '../services/api';
import type { User, LoginDto, RegisterDto } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario y token de las cookies al iniciar
    const storedToken = Cookies.get('token');
    const storedUser = Cookies.get('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      const response = await apiService.login(credentials);
      const { access_token, user: userData } = response;
      
      setToken(access_token);
      setUser(userData);
      
      // Configuración de cookies seguras
      const cookieOptions = {
        expires: 7, // 7 días
        secure: window.location.protocol === 'https:', // Solo HTTPS en producción
        sameSite: 'strict' as const, // Protección contra CSRF
      };
      
      Cookies.set('token', access_token, cookieOptions);
      Cookies.set('user', JSON.stringify(userData), cookieOptions);
    } catch (error: any) {
      console.error('Error de login:', error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const register = async (userData: RegisterDto) => {
    try {
      await apiService.register(userData);
      // Después de registrarse, hacer login automáticamente
      await login({ username: userData.username, password: userData.password });
    } catch (error: any) {
      console.error('Error de registro:', error);
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('token');
    Cookies.remove('user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

