import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../lib/auth-context';
import { AdminAuthProvider } from '../lib/admin-auth-context';
import { ScrollToTop } from './scroll-to-top';
import { AppRoutes } from '../routes/app-routes';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <ScrollToTop />
          <AppRoutes />
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

