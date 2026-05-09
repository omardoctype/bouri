import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../components/layout/public-layout';
import { ClientLayout } from '../components/layout/client-layout';
import { AdminLayout } from '../components/layout/admin-layout';
import {
  GuestAdminRoute,
  GuestClientRoute,
  ProtectedAdminRoute,
  ProtectedClientRoute,
} from './route-guards';
import { HomePage } from '../pages/public/home-page';
import { ServicesPage } from '../pages/public/services-page';
import { EventsPage } from '../pages/public/events-page';
import { ProvidersPage } from '../pages/public/providers-page';
import { PacksPage } from '../pages/public/packs-page';
import { AboutPage } from '../pages/public/about-page';
import { ContactPage } from '../pages/public/contact-page';
import { LoginPage } from '../pages/auth/login-page';
import { RegisterPage } from '../pages/auth/register-page';
import { AdminLoginPage } from '../pages/auth/admin-login-page';
import { ClientDashboardPage } from '../pages/client/client-dashboard-page';
import { ClientNewBookingPage } from '../pages/client/client-new-booking-page';
import { ClientBookingsPage } from '../pages/client/client-bookings-page';
import { ClientProfilePage } from '../pages/client/client-profile-page';
import { AdminDashboardPage } from '../pages/admin/admin-dashboard-page';
import { AdminBookingsPage } from '../pages/admin/admin-bookings-page';
import { AdminClientsPage } from '../pages/admin/admin-clients-page';
import { AdminProvidersPage } from '../pages/admin/admin-providers-page';
import { AdminServicesPage } from '../pages/admin/admin-services-page';
import { AdminStatisticsPage } from '../pages/admin/admin-statistics-page';
import { AdminSettingsPage } from '../pages/admin/admin-settings-page';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/providers" element={<ProvidersPage />} />
        <Route path="/packs" element={<PacksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route element={<GuestClientRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<GuestAdminRoute />}>
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Route>

      <Route element={<ProtectedClientRoute />}>
        <Route element={<ClientLayout />}>
          <Route path="/client/dashboard" element={<ClientDashboardPage />} />
          <Route path="/client/new-booking" element={<ClientNewBookingPage />} />
          <Route path="/client/bookings" element={<ClientBookingsPage />} />
          <Route path="/client/profile" element={<ClientProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/clients" element={<AdminClientsPage />} />
          <Route path="/admin/providers" element={<AdminProvidersPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

