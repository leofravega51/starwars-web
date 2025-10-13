export interface Film {
  _id: string;
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  url?: string;
  description?: string;
  uid?: string;
  source: 'api' | 'local';
  isModified: boolean;
  lastSyncDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFilmDto {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters?: string[];
  planets?: string[];
  starships?: string[];
  vehicles?: string[];
  species?: string[];
  url?: string;
  description?: string;
  uid?: string;
}

export interface UpdateFilmDto extends Partial<CreateFilmDto> {}

export interface User {
  _id: string;
  username: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface SyncResult {
  message: string;
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

