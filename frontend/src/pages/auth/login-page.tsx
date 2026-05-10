import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Crown, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';
import { LoginForm } from '../../components/forms/login-form';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../../components/ui/button';

export const LoginPage = () => {
  const { client, loginClientAction, loading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');

  const points = [
    t('auth.loginPage.points.trackReservations'),
    t('auth.loginPage.points.requestsStatus'),
    t('auth.loginPage.points.fastCommunication'),
  ];

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
        className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <Card className="relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -left-14 top-8 h-44 w-44 rounded-full bg-purpleLuxury/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-14 bottom-0 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />

          <div className={`relative ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="section-kicker">{t('auth.loginPage.clientSpaceKicker')}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-offWhite">{t('auth.loginPage.title')}</h1>
            <p className="mt-4 text-sm leading-relaxed text-gray-200">{t('auth.loginPage.subtitle')}</p>

            <div className="mt-6 space-y-3">
              {points.map((point) => (
                <div key={point} className="flex items-start gap-2 text-sm text-gray-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-goldLuxury" />
                  <p>{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/providers">
                  {t('auth.loginPage.viewTalents')} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/login">
                  <ShieldCheck className="h-4 w-4" /> {t('auth.loginPage.adminAccess')}
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-goldLuxury/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-pinkLuxury/25 blur-3xl" />

          <div className={`relative ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="mb-5 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-goldLuxury/35 bg-goldLuxury/10 text-goldLuxury">
                <Crown className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-goldLuxury">{t('auth.loginPage.secureLoginKicker')}</p>
                <p className="text-sm text-grayLuxury">{t('auth.loginPage.secureLoginSubtitle')}</p>
              </div>
            </div>

            <LoginForm
              submitLabel={loading ? t('auth.form.submittingLogin') : t('auth.form.submitLogin')}
              onSubmit={async (values) => {
                const result = await loginClientAction(values);
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
              {t('auth.loginPage.noAccount')}{' '}
              <Link to="/register" className="font-semibold text-goldLuxury hover:underline">
                {t('auth.loginPage.createSpace')}
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

