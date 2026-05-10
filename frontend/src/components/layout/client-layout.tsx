import { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarClock, CalendarPlus, LayoutDashboard, LogOut, Menu, UserRound, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/use-auth';
import { APP_NAME } from '../../data/constants';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

const SidebarContent = ({ onNavigate, isRTL }: { onNavigate?: () => void; isRTL: boolean }) => {
  const { client } = useAuth();
  const { t } = useTranslation();

  const nav = useMemo(
    () => [
      { to: '/client/dashboard', label: t('client.layout.nav.dashboard'), icon: LayoutDashboard },
      { to: '/client/new-booking', label: t('client.layout.nav.newBooking'), icon: CalendarPlus },
      { to: '/client/bookings', label: t('client.layout.nav.myBookings'), icon: CalendarClock },
      { to: '/client/profile', label: t('client.layout.nav.profile'), icon: UserRound },
    ],
    [t]
  );

  return (
    <>
      <Link to="/" className="mb-8 flex items-center gap-3" onClick={onNavigate}>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-goldLuxury/35 bg-goldLuxury/10 text-goldLuxury">
          B
        </span>
        <div>
          <p className="font-display text-xl text-offWhite">{APP_NAME}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-grayLuxury">{t('client.layout.clientSpace')}</p>
        </div>
      </Link>

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-grayLuxury">{t('client.layout.clientLabel')}</p>
        <p className="mt-2 font-semibold text-offWhite">{client?.fullName}</p>
        <p className="text-sm text-grayLuxury">{client?.email}</p>
        <div className="mt-4">
          <LanguageSwitcher className={cn('w-full', isRTL ? 'justify-start' : 'justify-center')} />
        </div>
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
                isActive && 'bg-white/10 text-goldLuxury'
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
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');
  const mobilePanelX = isRTL ? 280 : -280;

  const logout = () => {
    logoutClientAction();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-blackLuxury text-offWhite">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            'hidden w-72 shrink-0 bg-cardLuxury/65 p-5 lg:block',
            isRTL ? 'border-l border-white/10' : 'border-r border-white/10'
          )}
        >
          <SidebarContent isRTL={isRTL} />

          <Button className="mt-8" variant="ghost" fullWidth onClick={logout}>
            <LogOut className="h-4 w-4" /> {t('client.layout.logout')}
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
                initial={{ x: mobilePanelX }}
                animate={{ x: 0 }}
                exit={{ x: mobilePanelX }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className={cn(
                  'relative z-10 h-full w-72 bg-cardLuxury p-5',
                  isRTL ? 'ml-auto border-l border-white/10' : 'border-r border-white/10'
                )}
              >
                <div className="mb-4 flex items-center justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <SidebarContent onNavigate={() => setOpen(false)} isRTL={isRTL} />
                <Button className="mt-8" variant="ghost" fullWidth onClick={logout}>
                  <LogOut className="h-4 w-4" /> {t('client.layout.logout')}
                </Button>
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-blackLuxury/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:hidden">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl">{APP_NAME}</p>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
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

