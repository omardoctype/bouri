import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import axios from 'axios';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { FormError } from '../../components/forms/form-error';
import { ADMIN_CREDENTIALS } from '../../data/constants';
import type { AgencySettingsFormSchema } from '../../lib/validation';
import { getSettings, updateSettings } from '../../services/settingsApi';
import { PageHeader } from '../../components/ui/page-header';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | string | undefined;
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
      return payload.message;
    }
  }
  return fallback;
};

export const AdminSettingsPage = () => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const agencySettingsSchema = useMemo(
    () =>
      z.object({
        agencyName: z.string().min(2, t('admin.validation.requiredField')),
        agencyEmail: z.string().email(t('admin.validation.invalidEmail')),
        whatsappNumber: z.string().min(8, t('admin.validation.invalidWhatsAppNumber')),
        instagramLink: z.union([z.literal(''), z.string().url(t('admin.validation.invalidInstagramUrl'))]),
        facebookLink: z.union([z.literal(''), z.string().url(t('admin.validation.invalidFacebookUrl'))]),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AgencySettingsFormSchema>({
    resolver: zodResolver(agencySettingsSchema),
    defaultValues: {
      agencyName: '',
      agencyEmail: '',
      whatsappNumber: '',
      instagramLink: '',
      facebookLink: '',
    },
  });

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      setLoadingSettings(true);
      setFeedback(null);
      try {
        const data = await getSettings();
        if (!active) return;
        reset({
          agencyName: data.agencyName,
          agencyEmail: data.agencyEmail,
          whatsappNumber: data.whatsappNumber,
          instagramLink: data.instagramUrl || '',
          facebookLink: data.facebookUrl || '',
        });
      } catch (error) {
        if (!active) return;
        setFeedback({
          type: 'error',
          message: getErrorMessage(error, t('admin.settings.errors.loadSettings')),
        });
      } finally {
        if (active) setLoadingSettings(false);
      }
    };

    void loadSettings();

    return () => {
      active = false;
    };
  }, [reset, t]);

  const submit = handleSubmit(async (values) => {
    try {
      await updateSettings({
        agencyName: values.agencyName,
        agencyEmail: values.agencyEmail,
        whatsappNumber: values.whatsappNumber,
        instagramUrl: values.instagramLink,
        facebookUrl: values.facebookLink,
      });
      setFeedback({ type: 'success', message: t('admin.settings.feedback.saveSuccess') });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, t('admin.settings.errors.saveSettings')),
      });
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader title={t('admin.settings.header.title')} description={t('admin.settings.header.description')} />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="font-display text-2xl text-offWhite">{t('admin.settings.agencyInfo.title')}</h2>
          {loadingSettings ? <p className="mt-4 text-sm text-grayLuxury">{t('admin.settings.loading')}</p> : null}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="label-base">{t('admin.settings.fields.agencyName')}</label>
              <Input {...register('agencyName')} />
              <FormError message={errors.agencyName?.message} />
            </div>

            <div>
              <label className="label-base">{t('admin.settings.fields.agencyEmail')}</label>
              <Input type="email" {...register('agencyEmail')} />
              <FormError message={errors.agencyEmail?.message} />
            </div>

            <div>
              <label className="label-base">{t('admin.settings.fields.whatsappNumber')}</label>
              <Input {...register('whatsappNumber')} />
              <FormError message={errors.whatsappNumber?.message} />
            </div>

            <div>
              <label className="label-base">{t('admin.settings.fields.instagramLink')}</label>
              <Input {...register('instagramLink')} />
              <FormError message={errors.instagramLink?.message} />
            </div>

            <div>
              <label className="label-base">{t('admin.settings.fields.facebookLink')}</label>
              <Input {...register('facebookLink')} />
              <FormError message={errors.facebookLink?.message} />
            </div>

            {feedback ? (
              <p
                className={`rounded-lg border px-3 py-2 text-sm ${
                  feedback.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                }`}
              >
                {feedback.message}
              </p>
            ) : null}

            <Button type="submit" disabled={isSubmitting || loadingSettings}>
              {isSubmitting ? t('admin.settings.actions.saving') : t('admin.settings.actions.save')}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-2xl text-offWhite">{t('admin.settings.adminAccess.title')}</h2>
            <p className="mt-3 text-sm text-grayLuxury">{t('admin.settings.adminAccess.email')}: {ADMIN_CREDENTIALS.email}</p>
            <p className="text-sm text-grayLuxury">{t('admin.settings.adminAccess.password')}: {ADMIN_CREDENTIALS.password}</p>
          </Card>

          <Card>
            <h2 className="font-display text-2xl text-offWhite">{t('admin.settings.technicalNote.title')}</h2>
            <p className="mt-3 text-sm text-grayLuxury">{t('admin.settings.technicalNote.description')}</p>
          </Card>
        </div>
      </section>
    </div>
  );
};
