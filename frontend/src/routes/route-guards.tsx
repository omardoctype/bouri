import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center text-grayLuxury">Chargement...</div>
);

export const ProtectedClientRoute = () => {
  const { client, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingFallback />;

  if (!client) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (client.role !== 'CLIENT' && client.role !== 'ADMIN') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export const ProtectedAdminRoute = () => {
  const { client, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingFallback />;

  if (!client) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (client.role !== 'ADMIN') {
    return <Navigate to="/client/dashboard" replace />;
  }

  return <Outlet />;
};

export const GuestClientRoute = () => {
  const { client, loading } = useAuth();

  if (loading) return <LoadingFallback />;

  if (!client) {
    return <Outlet />;
  }

  if (client.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/client/dashboard" replace />;
};

export const GuestAdminRoute = () => {
  const { client, loading } = useAuth();

  if (loading) return <LoadingFallback />;

  if (!client) {
    return <Outlet />;
  }

  if (client.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/client/dashboard" replace />;
};

