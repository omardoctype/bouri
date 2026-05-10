import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';
import { LoginForm } from '../../components/forms/login-form';
import { useAdminAuth } from '../../hooks/use-admin-auth';

export const AdminLoginPage = () => {
  const { isAdminAuthenticated, loginAdminAction, loading } = useAdminAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');

  useEffect(() => {
    if (isAdminAuthenticated) navigate('/admin/dashboard');
  }, [isAdminAuthenticated, navigate]);

  return (
    <div className="page-shell flex min-h-screen items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden border-goldLuxury/30">
          <div className="pointer-events-none absolute -right-12 -top-10 h-32 w-32 rounded-full bg-goldLuxury/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-purpleLuxury/25 blur-3xl" />

          <div className={`relative ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-xs uppercase tracking-[0.16em] text-goldLuxury">{t('auth.adminLoginPage.brand')}</p>
            <h1 className="mt-2 font-display text-3xl text-offWhite">{t('auth.adminLoginPage.title')}</h1>
            <p className="mt-2 text-sm text-grayLuxury">{t('auth.adminLoginPage.subtitle')}</p>

            <div className="mt-6">
              <LoginForm
                submitLabel={loading ? t('auth.form.submittingLogin') : t('auth.adminLoginPage.submitAdmin')}
                onSubmit={async (values) => {
                  const result = await loginAdminAction(values);
                  if (result.ok) navigate('/admin/dashboard');
                  return result;
                }}
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

