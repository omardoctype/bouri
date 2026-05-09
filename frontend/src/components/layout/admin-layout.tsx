import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck2,
  Users,
  HandPlatter,
  BriefcaseBusiness,
  BarChart3,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAdminAuth } from '../../hooks/use-admin-auth';
import { APP_NAME } from '../../data/constants';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/bookings', label: 'Reservations', icon: CalendarCheck2 },
  { to: '/admin/clients', label: 'Clients', icon: Users },
  { to: '/admin/providers', label: 'Prestataires', icon: HandPlatter },
  { to: '/admin/services', label: 'Services', icon: BriefcaseBusiness },
  { to: '/admin/statistics', label: 'Statistiques', icon: BarChart3 },
  { to: '/admin/settings', label: 'Parametres', icon: Settings },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
  <>
    <Link to="/admin/dashboard" className="mb-8 flex items-center gap-2" onClick={onNavigate}>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-goldLuxury/45 bg-goldLuxury/10 text-goldLuxury">
        <Shield className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-xl">{APP_NAME}</p>
        <p className="text-xs uppercase tracking-[0.16em] text-grayLuxury">Admin Panel</p>
      </div>
    </Link>

    <nav className="space-y-2">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-grayLuxury transition hover:bg-white/5 hover:text-offWhite',
              isActive && 'bg-white/10 text-goldLuxury',
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  </>
);

export const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { logoutAdminAction } = useAdminAuth();
  const navigate = useNavigate();

  const logout = () => {
    logoutAdminAction();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-blackLuxury text-offWhite">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-cardLuxury/60 p-5 lg:block">
          <SidebarContent />
        </aside>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className="relative z-10 h-full w-72 border-r border-white/10 bg-cardLuxury p-5"
              >
                <div className="mb-4 flex items-center justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <SidebarContent onNavigate={() => setOpen(false)} />
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-blackLuxury/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button className="lg:hidden" variant="ghost" size="sm" onClick={() => setOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <p className="font-display text-xl">{APP_NAME} Admin</p>
                  <p className="text-xs text-grayLuxury">Cockpit de gestion</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-offWhite">Admin Bouri</p>
                  <p className="text-xs text-grayLuxury">admin@bourievents.tn</p>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" /> Deconnexion
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
