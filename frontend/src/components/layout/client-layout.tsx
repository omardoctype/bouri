import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarClock, CalendarPlus, LayoutDashboard, LogOut, Menu, UserRound, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/use-auth';
import { APP_NAME } from '../../data/constants';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const nav = [
  { to: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/client/new-booking', label: 'Nouvelle reservation', icon: CalendarPlus },
  { to: '/client/bookings', label: 'Mes reservations', icon: CalendarClock },
  { to: '/client/profile', label: 'Mon profil', icon: UserRound },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { client } = useAuth();

  return (
    <>
      <Link to="/" className="mb-8 flex items-center gap-3" onClick={onNavigate}>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-goldLuxury/35 bg-goldLuxury/10 text-goldLuxury">B</span>
        <div>
          <p className="font-display text-xl text-offWhite">{APP_NAME}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-grayLuxury">Client Space</p>
        </div>
      </Link>

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-grayLuxury">Client</p>
        <p className="mt-2 font-semibold text-offWhite">{client?.fullName}</p>
        <p className="text-sm text-grayLuxury">{client?.email}</p>
      </div>

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
};

export const ClientLayout = () => {
  const [open, setOpen] = useState(false);
  const { logoutClientAction } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    logoutClientAction();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-blackLuxury text-offWhite">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-cardLuxury/65 p-5 lg:block">
          <SidebarContent />

          <Button className="mt-8" variant="ghost" fullWidth onClick={logout}>
            <LogOut className="h-4 w-4" /> Deconnexion
          </Button>
        </aside>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
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
                <Button className="mt-8" variant="ghost" fullWidth onClick={logout}>
                  <LogOut className="h-4 w-4" /> Deconnexion
                </Button>
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-blackLuxury/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:hidden">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl">{APP_NAME}</p>
              <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

