import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { RegisterFormSchema } from '../../lib/validation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormError } from './form-error';
import { cn } from '../../lib/utils';

interface RegisterFormProps {
  onSubmit: (values: RegisterFormSchema) => { ok: boolean; message: string } | Promise<{ ok: boolean; message: string }>;
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');

  const registerSchema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(3, t('auth.validation.fullNameMin')),
        email: z.string().email(t('auth.validation.invalidEmail')),
        phone: z.string().min(8, t('auth.validation.phoneMin')),
        password: z.string().min(6, t('auth.validation.passwordMin')),
        city: z.string().min(2, t('auth.validation.cityMin')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      city: '',
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
        <label className="label-base">{t('auth.common.fullName')}</label>
        <Input placeholder={t('auth.form.fullNamePlaceholder')} {...register('fullName')} />
        <FormError message={errors.fullName?.message} />
      </div>

      <div>
        <label className="label-base">{t('auth.common.email')}</label>
        <Input type="email" placeholder={t('auth.form.emailPlaceholder')} {...register('email')} />
        <FormError message={errors.email?.message} />
      </div>

      <div>
        <label className="label-base">{t('auth.common.phone')}</label>
        <Input placeholder={t('auth.form.phonePlaceholder')} {...register('phone')} />
        <FormError message={errors.phone?.message} />
      </div>

      <div>
        <label className="label-base">{t('auth.common.city')}</label>
        <Input placeholder={t('auth.form.cityPlaceholder')} {...register('city')} />
        <FormError message={errors.city?.message} />
      </div>

      <div>
        <label className="label-base">{t('auth.common.password')}</label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.form.passwordMinPlaceholder')}
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
        {isSubmitting ? t('auth.form.submittingRegister') : t('auth.form.submitRegister')}
      </Button>
    </form>
  );
};

