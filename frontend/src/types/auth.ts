export type Role = 'CLIENT' | 'ADMIN';

export interface RegisterClientRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: Role;
}

export interface AuthUserSession {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
  avatarUrl?: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
  city: string;
}
