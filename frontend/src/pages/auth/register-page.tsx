import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Crown, Rocket, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';
import { RegisterForm } from '../../components/forms/register-form';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../../components/ui/button';

export const RegisterPage = () => {
  const { client, registerClientAction, loading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');

  useEffect(() => {
    if (!client) return;

    if (client.role === 'ADMIN') {
      navigate('/admin/dashboard');
      return;
    }

    navigate('/client/dashboard');
  }, [client, navigate]);

  return (
    <div className="page-shell py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1.02fr_0.98fr]"
      >
        <Card className="relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -left-8 -top-10 h-40 w-40 rounded-full bg-pinkLuxury/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 bottom-2 h-52 w-52 rounded-full bg-purpleLuxury/25 blur-3xl" />

          <div className={`relative ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="mb-5 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-goldLuxury/35 bg-goldLuxury/10 text-goldLuxury">
                <Crown className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-goldLuxury">{t('auth.registerPage.badgeTitle')}</p>
                <p className="text-sm text-grayLuxury">{t('auth.registerPage.badgeSubtitle')}</p>
              </div>
            </div>

            <RegisterForm
              onSubmit={async (values) => {
                const result = await registerClientAction(values);
                if (result.ok) {
                  if (result.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                  } else {
                    navigate('/client/dashboard');
                  }
                }
                return result;
              }}
            />

            <p className="mt-5 text-sm text-grayLuxury">
              {t('auth.registerPage.hasAccount')}{' '}
              <Link to="/login" className="font-semibold text-goldLuxury hover:underline">
                {t('auth.registerPage.signIn')}
              </Link>
            </p>

            {loading ? <p className="mt-3 text-xs text-grayLuxury">{t('auth.registerPage.loadingSession')}</p> : null}
          </div>
        </Card>

        <Card className="relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-14 top-6 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-goldLuxury/25 blur-3xl" />

          <div className={`relative ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="section-kicker">{t('auth.registerPage.welcomeKicker')}</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-offWhite">{t('auth.registerPage.title')}</h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-200">{t('auth.registerPage.subtitle')}</p>

            <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-start gap-2 text-sm text-gray-200">
                <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-goldLuxury" />
                <p>{t('auth.registerPage.highlights.brief')}</p>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-200">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-goldLuxury" />
                <p>{t('auth.registerPage.highlights.verified')}</p>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-200">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-goldLuxury" />
                <p>{t('auth.registerPage.highlights.support')}</p>
              </div>
            </div>

            <div className="mt-6">
              <Button asChild variant="ghost" size="sm">
                <Link to="/services">
                  {t('auth.registerPage.exploreServices')} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

