import { createContext } from 'react';
import type { LoginPayload, RegisterPayload } from '../types';
import type { AuthUserSession, Role } from '../types/auth';

export interface AuthActionResult {
  ok: boolean;
  message: string;
  role?: Role;
}

export interface AuthContextValue {
  client: AuthUserSession | null;
  loading: boolean;
  loginClientAction: (payload: LoginPayload) => Promise<AuthActionResult>;
  registerClientAction: (payload: RegisterPayload) => Promise<AuthActionResult>;
  logoutClientAction: () => void;
  refreshClient: () => Promise<void>;
  updateProfileAction: (values: {
    fullName: string;
    phone: string;
    city: string;
    avatarUrl?: string;
  }) => Promise<AuthActionResult>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

