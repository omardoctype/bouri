import { useCallback, useMemo } from 'react';
import { AdminAuthContext, type AdminAuthContextValue } from './admin-auth-context-base';
import { useAuth } from '../hooks/use-auth';

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { client, loading, loginClientAction, logoutClientAction, refreshClient } = useAuth();

  const isAuthenticated = client?.role === 'ADMIN';

  const loginAdminAction: AdminAuthContextValue['loginAdminAction'] = useCallback(
    async (payload) => {
      const result = await loginClientAction(payload);
      if (!result.ok) return result;

      if (result.role !== 'ADMIN') {
        logoutClientAction();
        return {
          ok: false,
          message: 'Acces refuse. Ce compte ne dispose pas des droits administrateur.',
        };
      }

      return result;
    },
    [loginClientAction, logoutClientAction],
  );

  const logoutAdminAction = useCallback(() => {
    logoutClientAction();
  }, [logoutClientAction]);

  const refreshAdminSession: AdminAuthContextValue['refreshAdminSession'] = useCallback(async () => {
    await refreshClient();
  }, [refreshClient]);

  const value = useMemo(
    () => ({
      isAdminAuthenticated: isAuthenticated,
      loading,
      loginAdminAction,
      logoutAdminAction,
      refreshAdminSession,
    }),
    [isAuthenticated, loading, loginAdminAction, logoutAdminAction, refreshAdminSession],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

