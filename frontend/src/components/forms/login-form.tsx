import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { LoginFormSchema } from '../../lib/validation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormError } from './form-error';
import { cn } from '../../lib/utils';

interface LoginFormProps {
  onSubmit: (values: LoginFormSchema) => { ok: boolean; message: string } | Promise<{ ok: boolean; message: string }>;
  submitLabel?: string;
}

export const LoginForm = ({ onSubmit, submitLabel }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');
  const resolvedSubmitLabel = submitLabel || t('auth.form.submitLogin');

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t('auth.validation.invalidEmail')),
        password: z.string().min(6, t('auth.validation.passwordMin')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const submit = handleSubmit(async (values) => {
    const result = await onSubmit(values);
    setFeedback({
      type: result.ok ? 'success' : 'error',
      message: result.message,
    });
  });

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label className="label-base">{t('auth.common.email')}</label>
        <Input type="email" placeholder={t('auth.form.emailPlaceholder')} {...register('email')} />
        <FormError message={errors.email?.message} />
      </div>

      <div>
        <label className="label-base">{t('auth.common.password')}</label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.form.passwordPlaceholder')}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-grayLuxury transition hover:text-offWhite',
              isRTL ? 'left-3' : 'right-3'
            )}
            aria-label={showPassword ? t('auth.form.hidePassword') : t('auth.form.showPassword')}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FormError message={errors.password?.message} />
      </div>

      {feedback ? (
        <p
          className={`rounded-lg border px-3 py-2 text-sm ${
            feedback.type === 'error'
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      <Button fullWidth type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('auth.form.submittingLogin') : resolvedSubmitLabel}
      </Button>
    </form>
  );
};

