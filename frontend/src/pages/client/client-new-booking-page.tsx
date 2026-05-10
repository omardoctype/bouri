import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MessageCircleMore, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { BookingRequestForm } from '../../components/forms/booking-request-form';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/use-auth';
import { createBooking as createBookingApi } from '../../services/bookingApi';
import { getPublicProviders } from '../../services/providerApi';
import { sendBookingEmail } from '../../lib/emailjs';
import { createWhatsappUrl } from '../../lib/whatsapp';
import type { BookingResponse } from '../../types/booking';
import type { ProviderResponse } from '../../types/provider';
import type { BookingFormSchema } from '../../lib/validation';
import { fromApiEventType, toApiEventType } from '../../utils/booking';
import { getBudgetLabel, getEventTypeLabel } from '../../utils/translationLabels';

interface ToastMessage {
  id: number;
  type: 'success' | 'warning' | 'error';
  message: string;
}

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

export const ClientNewBookingPage = () => {
  const { client } = useAuth();
  const { t } = useTranslation();
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [providersError, setProvidersError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingResponse | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const draftKey = useMemo(() => {
    if (!client) return 'bouri_booking_draft_guest';
    return `bouri_booking_draft_${client.id}`;
  }, [client]);

  useEffect(() => {
    let active = true;

    const loadProviders = async () => {
      setProvidersLoading(true);
      setProvidersError(null);
      try {
        const data = await getPublicProviders();
        if (!active) return;
        setProviders(data);
      } catch (error) {
        if (!active) return;
        setProvidersError(getErrorMessage(error, t('client.newBooking.errors.loadProviders')));
      } finally {
        if (active) {
          setProvidersLoading(false);
        }
      }
    };

    loadProviders();

    return () => {
      active = false;
    };
  }, [t]);

  const pushToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, type, message }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4600);
  };

  const defaultValues = useMemo(
    () => ({
      fullName: client?.fullName ?? '',
      email: client?.email ?? '',
      phone: client?.phone ?? '',
      city: client?.city ?? ''
    }),
    [client]
  );

  const providerOptions = useMemo(() => providers.map((provider) => ({ name: provider.name })), [providers]);

  const handleSubmit = async (values: BookingFormSchema) => {
    const preferredProviderName = values.preferredProvider && values.preferredProvider !== 'Aucun choix' ? values.preferredProvider : null;

    const preferredProvider = providers.find((provider) => provider.name === preferredProviderName) ?? null;

    try {
      const createdBooking = await createBookingApi({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        city: values.city,
        eventType: toApiEventType(values.eventType),
        eventDate: values.eventDate,
        location: values.location,
        guestsCount: values.guestsCount,
        budget: values.budget,
        requestedServices: values.requestedServices,
        preferredProviderId: preferredProvider?.id ?? null,
        preferredProviderName,
        message: values.message?.trim() || ''
      });

      setSubmittedBooking(createdBooking);
      pushToast('success', t('client.newBooking.toast.success'));

      const emailResult = await sendBookingEmail({
        ...createdBooking,
        eventType: fromApiEventType(createdBooking.eventType)
      });

      if (!emailResult.ok) {
        pushToast('warning', t('client.newBooking.toast.warningEmail'));
      }
    } catch (error) {
      pushToast('error', getErrorMessage(error, t('client.newBooking.errors.submit')));
    }
  };

  return (
    <div className="space-y-6">
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,380px)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-glass ${
              toast.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100'
                : toast.type === 'warning'
                  ? 'border-amber-500/45 bg-amber-500/15 text-amber-100'
                  : 'border-rose-500/45 bg-rose-500/15 text-rose-100'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-cardLuxury/70 p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-12 top-8 h-44 w-44 rounded-full bg-purpleLuxury/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-pinkLuxury/20 blur-3xl" />
        <div className="relative">
          <p className="section-kicker">{t('client.newBooking.hero.kicker')}</p>
          <h1 className="mt-3 font-display text-3xl text-offWhite sm:text-4xl">{t('client.newBooking.hero.title')}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-200">{t('client.newBooking.hero.subtitle')}</p>
        </div>
      </section>

      {providersLoading ? <Card className="p-6 text-sm text-grayLuxury">{t('client.newBooking.loading.providers')}</Card> : null}

      {providersError ? <Card className="border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">{providersError}</Card> : null}

      {!providersLoading && !submittedBooking ? (
        <Card className="p-4 sm:p-6">
          <BookingRequestForm
            providers={providerOptions}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitLabel={t('client.newBooking.form.submit')}
            draftKey={draftKey}
          />
        </Card>
      ) : null}

      {submittedBooking ? (
        <Card className="border-emerald-500/25 bg-emerald-500/8 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" /> {t('client.newBooking.success.badge')}
              </p>
              <h3 className="mt-2 font-display text-3xl text-offWhite">{t('client.newBooking.success.title')}</h3>
              <p className="mt-3 max-w-2xl text-sm text-gray-200">
                {t('client.newBooking.success.description', { reference: submittedBooking.reference })}
              </p>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-gray-200">
                <p className="inline-flex items-center gap-2 font-semibold text-offWhite">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" /> {t('client.newBooking.success.summaryTitle')}
                </p>
                <p className="mt-2">
                  {t('client.newBooking.success.fields.type')}: {getEventTypeLabel(submittedBooking.eventType, t)}
                </p>
                <p>
                  {t('client.newBooking.success.fields.city')}: {submittedBooking.city}
                </p>
                <p>
                  {t('client.newBooking.success.fields.budget')}: {getBudgetLabel(submittedBooking.budget, t)}
                </p>
                <p>
                  {t('client.newBooking.success.fields.date')}: {submittedBooking.eventDate}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-col">
              <Button asChild>
                <a
                  href={createWhatsappUrl({
                    ...submittedBooking,
                    eventType: fromApiEventType(submittedBooking.eventType)
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircleMore className="h-4 w-4" /> {t('client.newBooking.success.actions.whatsapp')}
                </a>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/client/bookings">
                  {t('client.newBooking.success.actions.myBookings')} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button type="button" variant="secondary" onClick={() => setSubmittedBooking(null)}>
                {t('client.newBooking.success.actions.newRequest')}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
};
