import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { ProfileFormSchema } from '../../lib/validation';
import { useAuth } from '../../hooks/use-auth';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { FormError } from '../../components/forms/form-error';
import { formatDateTime } from '../../utils/format';

export const ClientProfilePage = () => {
  const { client, refreshClient, updateProfileAction } = useAuth();
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const profileSchema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(3, t('client.validation.fullNameMin')),
        phone: z.string().min(8, t('client.validation.phoneRequired')),
        city: z.string().min(2, t('client.validation.cityRequired')),
        avatarUrl: z.union([z.literal(''), z.string().url(t('client.validation.avatarInvalid'))]),
      }),
    [t]
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: client?.fullName ?? '',
      phone: client?.phone ?? '',
      city: client?.city ?? '',
      avatarUrl: client?.avatarUrl ?? '',
    },
  });

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoadingProfile(true);
      await refreshClient();
      if (active) {
        setLoadingProfile(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [refreshClient]);

  useEffect(() => {
    reset({
      fullName: client?.fullName ?? '',
      phone: client?.phone ?? '',
      city: client?.city ?? '',
      avatarUrl: client?.avatarUrl ?? '',
    });
  }, [client, reset]);

  const avatarPreview = useWatch({
    control,
    name: 'avatarUrl',
  });

  const submit = handleSubmit(async (values) => {
    const result = await updateProfileAction({
      fullName: values.fullName,
      phone: values.phone,
      city: values.city,
      avatarUrl: values.avatarUrl || '',
    });

    setFeedback({
      type: result.ok ? 'success' : 'error',
      message: result.ok ? t('client.profile.feedback.success') : result.message || t('client.profile.feedback.error'),
    });
  });

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl text-offWhite sm:text-4xl">{t('client.profile.header.title')}</h1>
        <p className="mt-2 text-sm text-grayLuxury">{t('client.profile.header.description')}</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          {loadingProfile ? <p className="mb-4 text-sm text-grayLuxury">{t('client.profile.loading')}</p> : null}
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label className="label-base">{t('client.profile.fields.fullName')}</label>
              <Input {...register('fullName')} />
              <FormError message={errors.fullName?.message} />
            </div>

            <div>
              <label className="label-base">{t('client.profile.fields.phone')}</label>
              <Input {...register('phone')} />
              <FormError message={errors.phone?.message} />
            </div>

            <div>
              <label className="label-base">{t('client.profile.fields.city')}</label>
              <Input placeholder={t('client.profile.fields.cityPlaceholder')} {...register('city')} />
              <FormError message={errors.city?.message} />
            </div>

            <div>
              <label className="label-base">{t('client.profile.fields.avatarUrl')}</label>
              <Input placeholder="https://..." {...register('avatarUrl')} />
              <FormError message={errors.avatarUrl?.message} />
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

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('client.profile.actions.saving') : t('client.profile.actions.save')}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="font-display text-2xl text-offWhite">{t('client.profile.preview.title')}</h2>
          <div className="mt-4 flex items-center gap-3">
            <img
              src={avatarPreview || client?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
              alt={t('client.profile.preview.avatarAlt')}
              className="h-16 w-16 rounded-full border border-white/20 object-cover"
            />
            <div>
              <p className="font-semibold text-offWhite">{client?.fullName}</p>
              <p className="text-xs text-grayLuxury">{client?.email}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <p className="text-grayLuxury">{t('client.profile.preview.phone')}</p>
            <p className="font-semibold text-offWhite">{client?.phone || t('client.common.none')}</p>
            <p className="text-grayLuxury">{t('client.profile.preview.city')}</p>
            <p className="font-semibold text-offWhite">{client?.city || t('client.common.none')}</p>
            <p className="text-grayLuxury">{t('client.profile.preview.registeredAt')}</p>
            <p className="font-semibold text-offWhite">
              {client?.createdAt ? formatDateTime(client.createdAt) : t('client.common.none')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

