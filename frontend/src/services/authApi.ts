import { AUTH_STORAGE_KEYS, api } from '../lib/api';
import { safeStorage } from '../lib/safe-storage';
import type {
  AuthResponse,
  AuthUserSession,
  LoginRequest,
  RegisterClientRequest,
  UpdateProfileRequest,
  UserResponse,
} from '../types/auth';

const parseStoredUser = (value: string | null): AuthUserSession | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

    const user = parsed as Partial<AuthUserSession>;
    if (
      typeof user.id !== 'string' ||
      typeof user.fullName !== 'string' ||
      typeof user.email !== 'string' ||
      typeof user.phone !== 'string' ||
      typeof user.city !== 'string' ||
      (user.role !== 'CLIENT' && user.role !== 'ADMIN')
    ) {
      return null;
    }

    return {
      ...user,
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      city: user.city,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      active: user.active,
      avatarUrl: user.avatarUrl,
    };
  } catch {
    return null;
  }
};

const persistAuthResponse = (payload: AuthResponse) => {
  const session: AuthUserSession = {
    id: String(payload.id),
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    city: payload.city,
    role: payload.role,
  };

  setStoredAuthSession(payload.token, session);
};

export const getStoredToken = () => safeStorage.getItem(AUTH_STORAGE_KEYS.token);

export const getStoredUser = (): AuthUserSession | null => parseStoredUser(safeStorage.getItem(AUTH_STORAGE_KEYS.user));

export const setStoredAuthUser = (user: AuthUserSession) => {
  safeStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
};

export const setStoredAuthSession = (token: string, user: AuthUserSession) => {
  safeStorage.setItem(AUTH_STORAGE_KEYS.token, token);
  setStoredAuthUser(user);
};

export const clearStoredAuthSession = () => {
  safeStorage.removeItem(AUTH_STORAGE_KEYS.token);
  safeStorage.removeItem(AUTH_STORAGE_KEYS.user);
};

export const registerClient = async (data: RegisterClientRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  persistAuthResponse(response.data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  persistAuthResponse(response.data);
  return response.data;
};

export const getMe = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>('/client/me');
  return response.data;
};

export const updateMe = async (data: UpdateProfileRequest): Promise<UserResponse> => {
  const response = await api.put<UserResponse>('/client/me', data);
  return response.data;
};
