import { useMemo, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../hooks/use-admin-auth';
import { APP_NAME } from '../../data/constants';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

const SidebarContent = ({ onNavigate, isRTL }: { onNavigate?: () => void; isRTL: boolean }) => {
  const { t } = useTranslation();

  const nav = useMemo(
    () => [
      { to: '/admin/dashboard', label: t('admin.layout.nav.dashboard'), icon: LayoutDashboard },
      { to: '/admin/bookings', label: t('admin.layout.nav.bookings'), icon: CalendarCheck2 },
      { to: '/admin/clients', label: t('admin.layout.nav.clients'), icon: Users },
      { to: '/admin/providers', label: t('admin.layout.nav.providers'), icon: HandPlatter },
      { to: '/admin/services', label: t('admin.layout.nav.services'), icon: BriefcaseBusiness },
      { to: '/admin/statistics', label: t('admin.layout.nav.statistics'), icon: BarChart3 },
      { to: '/admin/settings', label: t('admin.layout.nav.settings'), icon: Settings },
    ],
    [t]
  );

  return (
    <>
      <Link to="/admin/dashboard" className="mb-8 flex items-center gap-2" onClick={onNavigate}>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-goldLuxury/45 bg-goldLuxury/10 text-goldLuxury">
          <Shield className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-xl">{APP_NAME}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-grayLuxury">{t('admin.layout.badge')}</p>
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
                isActive && 'bg-white/10 text-goldLuxury'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6">
        <LanguageSwitcher className={cn('w-full', isRTL ? 'justify-start' : 'justify-center')} />
      </div>
    </>
  );
};

export const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { logoutAdminAction } = useAdminAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');
  const mobilePanelX = isRTL ? 280 : -280;

  const logout = () => {
    logoutAdminAction();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-blackLuxury text-offWhite">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            'hidden w-72 shrink-0 bg-cardLuxury/60 p-5 lg:block',
            isRTL ? 'border-l border-white/10' : 'border-r border-white/10'
          )}
        >
          <SidebarContent isRTL={isRTL} />
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
                  <p className="font-display text-xl">{t('admin.layout.topbar.title', { appName: APP_NAME })}</p>
                  <p className="text-xs text-grayLuxury">{t('admin.layout.topbar.subtitle')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={cn('hidden sm:block', isRTL ? 'text-left' : 'text-right')}>
                  <p className="text-sm font-semibold text-offWhite">{t('admin.layout.topbar.adminName')}</p>
                  <p className="text-xs text-grayLuxury">admin@bourievents.tn</p>
                </div>
                <LanguageSwitcher />
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" /> {t('admin.layout.topbar.logout')}
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
