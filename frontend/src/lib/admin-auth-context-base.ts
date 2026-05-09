import { createContext } from 'react';
import type { LoginPayload } from '../types';
import type { AuthActionResult } from './auth-context-base';

export interface AdminAuthContextValue {
  isAdminAuthenticated: boolean;
  loading: boolean;
  loginAdminAction: (payload: LoginPayload) => Promise<AuthActionResult>;
  logoutAdminAction: () => void;
  refreshAdminSession: () => Promise<void>;
}

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

