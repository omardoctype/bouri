import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { FormError } from '../../components/forms/form-error';
import { ADMIN_CREDENTIALS } from '../../data/constants';
import { agencySettingsSchema, type AgencySettingsFormSchema } from '../../lib/validation';
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
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

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
          message: getErrorMessage(error, 'Echec du chargement des parametres agence.'),
        });
      } finally {
        if (active) setLoadingSettings(false);
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, [reset]);

  const submit = handleSubmit(async (values) => {
    try {
      await updateSettings({
        agencyName: values.agencyName,
        agencyEmail: values.agencyEmail,
        whatsappNumber: values.whatsappNumber,
        instagramUrl: values.instagramLink,
        facebookUrl: values.facebookLink,
      });
      setFeedback({ type: 'success', message: 'Parametres agences sauvegardes.' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Echec sauvegarde des parametres.'),
      });
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Parametres plateforme" description="Configuration agence via API backend." />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="font-display text-2xl text-offWhite">Informations agence</h2>
          {loadingSettings ? <p className="mt-4 text-sm text-grayLuxury">Chargement des parametres...</p> : null}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="label-base">Nom agence</label>
              <Input {...register('agencyName')} />
              <FormError message={errors.agencyName?.message} />
            </div>

            <div>
              <label className="label-base">Email agence</label>
              <Input type="email" {...register('agencyEmail')} />
              <FormError message={errors.agencyEmail?.message} />
            </div>

            <div>
              <label className="label-base">Numero WhatsApp</label>
              <Input {...register('whatsappNumber')} />
              <FormError message={errors.whatsappNumber?.message} />
            </div>

            <div>
              <label className="label-base">Lien Instagram</label>
              <Input {...register('instagramLink')} />
              <FormError message={errors.instagramLink?.message} />
            </div>

            <div>
              <label className="label-base">Lien Facebook</label>
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
              {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder les parametres'}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-2xl text-offWhite">Acces admin MVP</h2>
            <p className="mt-3 text-sm text-grayLuxury">Email: {ADMIN_CREDENTIALS.email}</p>
            <p className="text-sm text-grayLuxury">Mot de passe: {ADMIN_CREDENTIALS.password}</p>
          </Card>

          <Card>
            <h2 className="font-display text-2xl text-offWhite">Note technique</h2>
            <p className="mt-3 text-sm text-grayLuxury">
              Ces parametres sont sauvegardes via Spring Boot et persistents en base de donnees.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

