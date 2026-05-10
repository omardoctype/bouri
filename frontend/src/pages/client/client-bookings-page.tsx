import { useEffect, useState } from 'react';
import { MessageCircleMore, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getMyBookings } from '../../services/bookingApi';
import { Card } from '../../components/ui/card';
import { StatusBadge, PillBadge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/modal';
import { createWhatsappUrl } from '../../lib/whatsapp';
import { formatDate, formatDateTime } from '../../utils/format';
import type { BookingResponse } from '../../types/booking';
import { EmptyState } from '../../components/ui/empty-state';
import { PageHeader } from '../../components/ui/page-header';
import { getBookingStatusLabel, getBudgetLabel, getEventTypeLabel, getServiceLabel } from '../../utils/translationLabels';

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

export const ClientBookingsPage = () => {
  const { t } = useTranslation();
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(getErrorMessage(err, t('client.bookings.errors.loadBookings')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, [t]);

  return (
    <div className="space-y-6">
      <PageHeader title={t('client.bookings.header.title')} description={t('client.bookings.header.description')} />

      {loading ? <Card className="p-6 text-sm text-grayLuxury">{t('client.bookings.loading')}</Card> : null}

      {!loading && error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm text-rose-200">{error}</p>
          <div className="mt-4">
            <Button type="button" variant="ghost" onClick={loadBookings}>
              <RefreshCcw className="h-4 w-4" /> {t('client.bookings.retry')}
            </Button>
          </div>
        </Card>
      ) : null}

      {!loading && !error && bookings.length ? (
        <Card>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-offWhite">{getEventTypeLabel(booking.eventType, t)}</h3>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-3 grid gap-2 text-sm text-gray-200 sm:grid-cols-2">
                  <p>
                    {t('client.bookings.fields.eventDate')}: {formatDate(booking.eventDate)}
                  </p>
                  <p>
                    {t('client.bookings.fields.city')}: {booking.city}
                  </p>
                  <p>
                    {t('client.bookings.fields.budget')}: {getBudgetLabel(booking.budget, t)}
                  </p>
                  <p>
                    {t('client.bookings.fields.createdAt')}: {formatDateTime(booking.createdAt)}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {booking.requestedServices.map((service) => (
                    <PillBadge key={`${booking.id}-${service}`} text={getServiceLabel(service, t)} />
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                    {t('client.bookings.actions.details')}
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <a
                      href={createWhatsappUrl({
                        ...booking,
                        preferredProviderName: booking.preferredProviderName || '',
                      })}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircleMore className="h-4 w-4" /> {t('client.bookings.actions.contactAdmin')}
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {!loading && !error && bookings.length === 0 ? (
        <EmptyState
          title={t('client.bookings.empty.title')}
          description={t('client.bookings.empty.description')}
        />
      ) : null}

      <Modal
        open={Boolean(selectedBooking)}
        title={
          selectedBooking ? t('client.bookings.modal.title', { reference: selectedBooking.reference }) : ''
        }
        onClose={() => setSelectedBooking(null)}
      >
        {selectedBooking ? (
          <div className="space-y-3 text-sm text-gray-200">
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.type')}:</span>{' '}
              {getEventTypeLabel(selectedBooking.eventType, t)}
            </p>
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.date')}:</span>{' '}
              {formatDate(selectedBooking.eventDate)}
            </p>
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.city')}:</span>{' '}
              {selectedBooking.city}
            </p>
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.location')}:</span>{' '}
              {selectedBooking.location}
            </p>
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.guests')}:</span>{' '}
              {selectedBooking.guestsCount}
            </p>
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.budget')}:</span>{' '}
              {getBudgetLabel(selectedBooking.budget, t)}
            </p>
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.preferredProvider')}:</span>{' '}
              {selectedBooking.preferredProviderName || t('client.common.none')}
            </p>
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.services')}:</span>{' '}
              {selectedBooking.requestedServices.length
                ? selectedBooking.requestedServices.map((service) => getServiceLabel(service, t)).join(', ')
                : t('client.common.none')}
            </p>
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.message')}:</span>{' '}
              {selectedBooking.message || t('client.common.none')}
            </p>
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.status')}:</span>{' '}
              {getBookingStatusLabel(selectedBooking.status, t)}
            </p>
            <p>
              <span className="text-grayLuxury">{t('client.bookings.modal.fields.createdAt')}:</span>{' '}
              {formatDateTime(selectedBooking.createdAt)}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
