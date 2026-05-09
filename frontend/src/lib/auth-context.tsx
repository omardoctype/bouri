import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext, type AuthContextValue } from './auth-context-base';
import {
  clearStoredAuthSession,
  getMe,
  getStoredToken,
  getStoredUser,
  login,
  registerClient,
  setStoredAuthUser,
  updateMe,
} from '../services/authApi';
import type { AuthResponse, AuthUserSession, UserResponse } from '../types/auth';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | string | undefined;
    if (typeof data === 'string' && data.trim()) {
      return data;
    }
    if (data && typeof data === 'object' && typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

const sessionFromAuthResponse = (payload: AuthResponse): AuthUserSession => ({
  id: String(payload.id),
  fullName: payload.fullName,
  email: payload.email,
  phone: payload.phone,
  city: payload.city,
  role: payload.role,
});

const sessionFromUserResponse = (profile: UserResponse, currentSession: AuthUserSession | null): AuthUserSession => ({
  id: String(profile.id),
  fullName: profile.fullName,
  email: profile.email,
  phone: profile.phone,
  city: profile.city,
  role: profile.role,
  active: profile.active,
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
  avatarUrl: currentSession?.avatarUrl ?? '',
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<AuthUserSession | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  const logoutClientAction = useCallback(() => {
    clearStoredAuthSession();
    setClient(null);
  }, []);

  const refreshClient = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setClient(null);
      return;
    }

    const stored = getStoredUser();
    if (stored) {
      setClient(stored);
    }

    try {
      const profile = await getMe();
      const nextSession = sessionFromUserResponse(profile, stored);
      setStoredAuthUser(nextSession);
      setClient(nextSession);
    } catch {
      clearStoredAuthSession();
      setClient(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      await refreshClient();
      if (active) {
        setLoading(false);
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, [refreshClient]);

  const loginClientAction: AuthContextValue['loginClientAction'] = useCallback(async (payload) => {
    try {
      const auth = await login(payload);
      const fallbackSession = sessionFromAuthResponse(auth);
      const profile = await getMe();
      const session = sessionFromUserResponse(profile, fallbackSession);
      setStoredAuthUser(session);
      setClient(session);
      return { ok: true, message: 'Connexion reussie.', role: session.role };
    } catch (error) {
      clearStoredAuthSession();
      setClient(null);
      return {
        ok: false,
        message: getErrorMessage(error, 'Connexion impossible. Veuillez reessayer.'),
      };
    }
  }, []);

  const registerClientAction: AuthContextValue['registerClientAction'] = useCallback(async (payload) => {
    try {
      const auth = await registerClient(payload);
      const fallbackSession = sessionFromAuthResponse(auth);
      const profile = await getMe();
      const session = sessionFromUserResponse(profile, fallbackSession);
      setStoredAuthUser(session);
      setClient(session);
      return { ok: true, message: 'Compte cree avec succes.', role: session.role };
    } catch (error) {
      clearStoredAuthSession();
      setClient(null);
      return {
        ok: false,
        message: getErrorMessage(error, "Inscription impossible. Verifiez vos informations."),
      };
    }
  }, []);

  const updateProfileAction: AuthContextValue['updateProfileAction'] = useCallback(
    async (values) => {
      if (!client) {
        return { ok: false, message: 'Session client indisponible.' };
      }

      try {
        const profile = await updateMe({
          fullName: values.fullName,
          phone: values.phone,
          city: values.city,
        });

        const updatedSession = {
          ...sessionFromUserResponse(profile, client),
          avatarUrl: values.avatarUrl?.trim() || client.avatarUrl || '',
        };

        setStoredAuthUser(updatedSession);
        setClient(updatedSession);

        return { ok: true, message: 'Profil mis a jour.', role: updatedSession.role };
      } catch (error) {
        return {
          ok: false,
          message: getErrorMessage(error, 'Impossible de mettre a jour le profil.'),
        };
      }
    },
    [client],
  );

  const value = useMemo(
    () => ({
      client,
      loading,
      loginClientAction,
      registerClientAction,
      logoutClientAction,
      refreshClient,
      updateProfileAction,
    }),
    [client, loading, loginClientAction, registerClientAction, logoutClientAction, refreshClient, updateProfileAction],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

