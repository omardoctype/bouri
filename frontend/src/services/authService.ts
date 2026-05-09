import { ADMIN_CREDENTIALS } from '../data/constants';
import {
  getCurrentClient as getCurrentClientFromStorage,
  initializeStorage,
  isAdminAuthenticated,
  loginAdmin as loginAdminInStorage,
  loginClient as loginClientInStorage,
  logoutAdmin as logoutAdminInStorage,
  logoutClient as logoutClientInStorage,
  registerClient as registerClientInStorage,
} from '../lib/storage';
import type { ClientUser, LoginPayload, RegisterPayload } from '../types';

export interface AdminSession {
  email: string;
  role: 'admin';
}

export const initializeAuth = () => {
  initializeStorage();
};

export const registerClient = (data: RegisterPayload) => {
  return registerClientInStorage(data);
};

export const loginClient = (email: string, password: string) => {
  const payload: LoginPayload = { email, password };
  return loginClientInStorage(payload);
};

export const logoutClient = () => {
  logoutClientInStorage();
};

export const getCurrentClient = (): ClientUser | null => {
  return getCurrentClientFromStorage();
};

export const loginAdmin = (email: string, password: string) => {
  const payload: LoginPayload = { email, password };
  return loginAdminInStorage(payload);
};

export const logoutAdmin = () => {
  logoutAdminInStorage();
};

export const getCurrentAdmin = (): AdminSession | null => {
  if (!isAdminAuthenticated()) return null;

  return {
    email: ADMIN_CREDENTIALS.email,
    role: 'admin',
  };
};
