import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowRight, Crown, Menu, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '../../data/constants';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/use-auth';
import { cn } from '../../lib/utils';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

export const PublicLayout = () => {
  const [open, setOpen] = useState(false);
  const { client } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/events', label: t('nav.events') },
    { to: '/providers', label: t('nav.providers') },
    { to: '/packs', label: t('nav.packs') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') }
  ];

  return (
    <div className="min-h-screen bg-blackLuxury text-offWhite">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-blackLuxury/80 backdrop-blur-2xl">
        <div className="page-shell relative flex h-20 items-center justify-between gap-4">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-goldLuxury/35 to-transparent" />

          <Link to="/" className="group flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-goldLuxury/40 bg-goldLuxury/10 text-goldLuxury transition group-hover:scale-105 group-hover:bg-goldLuxury/20">
              <Crown className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl leading-none">{APP_NAME}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-grayLuxury">{t('public.nav.tagline')}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-semibold text-grayLuxury transition hover:bg-white/10 hover:text-offWhite',
                    isActive && 'bg-white/10 text-goldLuxury'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">{t('nav.login')}</Link>
            </Button>
            {client ? (
              <Button size="sm" onClick={() => navigate('/client/dashboard')}>
                {t('nav.dashboard')} <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link to="/register">
                  {t('public.nav.start')} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="absolute right-0 top-0 h-full w-[86vw] max-w-sm border-l border-white/10 bg-cardLuxury/95 p-5"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="font-display text-2xl">{APP_NAME}</p>
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="section-kicker">{t('public.nav.premiumAgency')}</p>
                <p className="mt-2 text-sm text-gray-200">{t('public.nav.mobileDescription')}</p>
                <div className="mt-4">
                  <LanguageSwitcher className="w-full justify-center" />
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-xl border border-transparent px-3 py-3 text-sm font-semibold text-grayLuxury transition hover:border-white/10 hover:bg-white/5 hover:text-offWhite',
                        isActive && 'border-white/10 bg-white/10 text-goldLuxury'
                      )
                    }
                  >
                    {item.label}
                    <Sparkles className="h-4 w-4" />
                  </NavLink>
                ))}
              </nav>

              <div className="premium-divider" />

              <div className="space-y-2">
                <Button asChild variant="ghost" fullWidth>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    {t('nav.login')}
                  </Link>
                </Button>
                {client ? (
                  <Button
                    fullWidth
                    onClick={() => {
                      navigate('/client/dashboard');
                      setOpen(false);
                    }}
                  >
                    {t('public.nav.clientSpace')}
                  </Button>
                ) : (
                  <Button asChild fullWidth>
                    <Link to="/register" onClick={() => setOpen(false)}>
                      {t('public.nav.organizeEvent')}
                    </Link>
                  </Button>
                )}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="relative">
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-white/10 bg-black/40">
        <div className="page-shell py-10 text-sm text-grayLuxury">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-display text-xl text-offWhite">{APP_NAME}</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed">{t('public.footer.description')}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-goldLuxury">{t('public.footer.navigation')}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {navItems.slice(0, 5).map((item) => (
                  <Link key={item.to} to={item.to} className="text-sm text-grayLuxury transition hover:text-offWhite">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-goldLuxury">{t('public.footer.contact')}</p>
              <p className="mt-3 text-sm text-offWhite">+216 71 900 115</p>
              <p className="mt-1 text-sm text-offWhite">contact@bourievents.tn</p>
              <p className="mt-1 text-sm">{t('public.footer.availability')}</p>
            </div>
          </div>
          <div className="premium-divider" />
          <p className="text-xs text-grayLuxury/90">
            (c) {new Date().getFullYear()} {APP_NAME}. {t('public.footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
};
