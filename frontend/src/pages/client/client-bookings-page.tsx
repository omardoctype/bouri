import { useEffect, useState } from 'react';
import { MessageCircleMore, RefreshCcw } from 'lucide-react';
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
import { fromApiBookingStatus, fromApiEventType } from '../../utils/booking';

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | string | undefined;
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
      return payload.message;
    }
  }
  return 'Impossible de charger vos reservations pour le moment.';
};

export const ClientBookingsPage = () => {
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
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Mes reservations" description="Suivez le statut de chaque demande en temps reel." />

      {loading ? (
        <Card className="p-6 text-sm text-grayLuxury">Chargement de vos reservations...</Card>
      ) : null}

      {!loading && error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm text-rose-200">{error}</p>
          <div className="mt-4">
            <Button type="button" variant="ghost" onClick={loadBookings}>
              <RefreshCcw className="h-4 w-4" /> Reessayer
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
                  <h3 className="text-lg font-bold text-offWhite">{fromApiEventType(booking.eventType)}</h3>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-3 grid gap-2 text-sm text-gray-200 sm:grid-cols-2">
                  <p>Date evenement: {formatDate(booking.eventDate)}</p>
                  <p>Ville: {booking.city}</p>
                  <p>Budget: {booking.budget}</p>
                  <p>Cree le: {formatDateTime(booking.createdAt)}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {booking.requestedServices.map((service) => (
                    <PillBadge key={`${booking.id}-${service}`} text={service} />
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                    Details
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
                      <MessageCircleMore className="h-4 w-4" /> Contacter admin
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
          title="Aucune reservation"
          description="Vous n'avez pas encore de reservation. Lancez votre premiere demande en quelques etapes."
        />
      ) : null}

      <Modal
        open={Boolean(selectedBooking)}
        title={selectedBooking ? `Reservation ${selectedBooking.reference}` : ''}
        onClose={() => setSelectedBooking(null)}
      >
        {selectedBooking ? (
          <div className="space-y-3 text-sm text-gray-200">
            <p>
              <span className="text-grayLuxury">Type:</span> {fromApiEventType(selectedBooking.eventType)}
            </p>
            <p>
              <span className="text-grayLuxury">Date:</span> {formatDate(selectedBooking.eventDate)}
            </p>
            <p>
              <span className="text-grayLuxury">Ville:</span> {selectedBooking.city}
            </p>
            <p>
              <span className="text-grayLuxury">Lieu:</span> {selectedBooking.location}
            </p>
            <p>
              <span className="text-grayLuxury">Invites:</span> {selectedBooking.guestsCount}
            </p>
            <p>
              <span className="text-grayLuxury">Budget:</span> {selectedBooking.budget}
            </p>
            <p>
              <span className="text-grayLuxury">Prestataire prefere:</span>{' '}
              {selectedBooking.preferredProviderName || '-'}
            </p>
            <p>
              <span className="text-grayLuxury">Services:</span> {selectedBooking.requestedServices.join(', ')}
            </p>
            <p>
              <span className="text-grayLuxury">Message:</span> {selectedBooking.message || '-'}
            </p>
            <p>
              <span className="text-grayLuxury">Statut:</span> {fromApiBookingStatus(selectedBooking.status)}
            </p>
            <p>
              <span className="text-grayLuxury">Creation:</span> {formatDateTime(selectedBooking.createdAt)}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

