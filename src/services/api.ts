import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import type { 
  Film, 
  CreateFilmDto, 
  UpdateFilmDto, 
  LoginDto, 
  RegisterDto, 
  AuthResponse,
  User,
  SyncResult 
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token a las peticiones
    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar errores de autenticación
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          Cookies.remove('token');
          Cookies.remove('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Endpoints de autenticación
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const { data } = await this.api.post<AuthResponse>('/users/login', credentials);
    return data;
  }

  async register(userData: RegisterDto): Promise<User> {
    const { data } = await this.api.post<User>('/users/register', userData);
    return data;
  }

  async getProfile(): Promise<User> {
    const { data } = await this.api.get<User>('/users/profile');
    return data;
  }

  // Endpoints de películas
  async getFilms(): Promise<Film[]> {
    const { data } = await this.api.get<Film[]>('/starwars/films');
    return data;
  }

  async getFilm(id: string): Promise<Film> {
    const { data } = await this.api.get<Film>(`/starwars/films/${id}`);
    return data;
  }

  async getFilmsFromApi(fullinfo: boolean = false): Promise<any> {
    const { data } = await this.api.get(`/starwars/films/external`, {
      params: { fullinfo }
    });
    return data;
  }

  async createFilm(filmData: CreateFilmDto): Promise<Film> {
    const { data } = await this.api.post<Film>('/starwars/films', filmData);
    return data;
  }

  async updateFilm(id: string, filmData: UpdateFilmDto): Promise<Film> {
    const { data } = await this.api.put<Film>(`/starwars/films/${id}`, filmData);
    return data;
  }

  async deleteFilm(id: string): Promise<void> {
    await this.api.delete(`/starwars/films/${id}`);
  }

  async syncFilms(): Promise<SyncResult> {
    const { data } = await this.api.post<SyncResult>('/starwars/films/sync');
    return data;
  }
}

export const apiService = new ApiService();

