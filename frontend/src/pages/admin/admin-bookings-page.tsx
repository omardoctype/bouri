import { useEffect, useMemo, useState } from 'react';
import { MessageCircleMore, RefreshCcw, Search, Trash2 } from 'lucide-react';
import axios from 'axios';
import { BUDGET_OPTIONS } from '../../data/constants';
import type { BookingResponse, BookingStatus, EventType } from '../../types/booking';
import {
  deleteBooking,
  getAllBookings,
  getBooking,
  updateBookingNote,
  updateBookingStatus,
} from '../../services/bookingApi';
import { formatDate, formatDateTime } from '../../utils/format';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { StatusBadge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';
import { Button } from '../../components/ui/button';
import { EmptyState } from '../../components/ui/empty-state';
import { ConfirmModal } from '../../components/ui/confirm-modal';
import { PageHeader } from '../../components/ui/page-header';
import {
  BOOKING_STATUS_OPTIONS,
  EVENT_TYPE_OPTIONS,
  fromApiBookingStatus,
  fromApiEventType,
} from '../../utils/booking';
import { Textarea } from '../../components/ui/textarea';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus recentes' },
  { value: 'oldest', label: 'Plus anciennes' },
  { value: 'eventDate', label: 'Date evenement' },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

const sanitizePhone = (value: string) => value.replace(/[^\d]/g, '');

const buildClientWhatsappUrl = (booking: BookingResponse) => {
  const phone = sanitizePhone(booking.phone);
  if (!phone) return '';
  const message = encodeURIComponent(
    `Bonjour ${booking.fullName}, nous revenons vers vous concernant votre reservation ${booking.reference} chez Bouri Events.`,
  );
  return `https://wa.me/${phone}?text=${message}`;
};

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

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [eventFilter, setEventFilter] = useState<'ALL' | EventType>('ALL');
  const [budgetFilter, setBudgetFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortValue>('newest');

  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<BookingResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    setActionError(null);
    try {
      const data = await getAllBookings({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        eventType: eventFilter === 'ALL' ? undefined : eventFilter,
        search: debouncedSearch || undefined,
      });
      setBookings(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de charger les reservations.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter, eventFilter, debouncedSearch]);

  const filtered = useMemo(() => {
    const rows = bookings.filter((booking) => budgetFilter === 'ALL' || booking.budget === budgetFilter);

    rows.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      if (sortBy === 'eventDate') {
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return rows;
  }, [bookings, budgetFilter, sortBy]);

  const openBookingDetails = async (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setDetailLoading(true);
    setActionError(null);
    try {
      const fullBooking = await getBooking(bookingId);
      setSelectedBooking(fullBooking);
      setNoteDraft(fullBooking.adminNote ?? '');
    } catch (err) {
      setActionError(getErrorMessage(err, 'Impossible de charger les details de reservation.'));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedBookingId(null);
    setSelectedBooking(null);
    setNoteDraft('');
  };

  const applyUpdatedBooking = (updated: BookingResponse) => {
    setBookings((current) => current.map((booking) => (booking.id === updated.id ? updated : booking)));
    setSelectedBooking((current) => (current?.id === updated.id ? updated : current));
  };

  const changeStatus = async (bookingId: number, status: BookingStatus) => {
    setActionError(null);
    try {
      const updated = await updateBookingStatus(bookingId, status);
      applyUpdatedBooking(updated);
    } catch (err) {
      setActionError(getErrorMessage(err, 'Echec de mise a jour du statut.'));
    }
  };

  const saveAdminNote = async () => {
    if (!selectedBooking) return;
    setSavingNote(true);
    setActionError(null);
    try {
      const updated = await updateBookingNote(selectedBooking.id, noteDraft.trim() || '-');
      applyUpdatedBooking(updated);
    } catch (err) {
      setActionError(getErrorMessage(err, "Impossible d'enregistrer la note admin."));
    } finally {
      setSavingNote(false);
    }
  };

  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) return;
    setActionError(null);
    try {
      await deleteBooking(bookingToDelete.id);
      setBookings((current) => current.filter((booking) => booking.id !== bookingToDelete.id));
      setSelectedBooking((current) => (current?.id === bookingToDelete.id ? null : current));
      setBookingToDelete(null);
    } catch (err) {
      setActionError(getErrorMessage(err, 'Suppression impossible pour le moment.'));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des reservations"
        description="Recherchez, filtrez, triez et pilotez le statut de toutes les demandes client."
      />

      <Card>
        <div className="grid gap-3 xl:grid-cols-[1fr_220px_220px_220px_220px]">
          <label className="relative xl:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grayLuxury" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher nom, email, telephone, ville"
              className="pl-9"
            />
          </label>

          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'ALL' | BookingStatus)}>
            <option value="ALL">Tous les statuts</option>
            {BOOKING_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>

          <Select value={eventFilter} onChange={(event) => setEventFilter(event.target.value as 'ALL' | EventType)}>
            <option value="ALL">Tous les evenements</option>
            {EVENT_TYPE_OPTIONS.map((eventType) => (
              <option key={eventType.value} value={eventType.value}>
                {eventType.label}
              </option>
            ))}
          </Select>

          <Select value={budgetFilter} onChange={(event) => setBudgetFilter(event.target.value)}>
            <option value="ALL">Tous les budgets</option>
            {BUDGET_OPTIONS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </Select>

          <Select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortValue)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Tri: {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {loading ? <Card className="p-6 text-sm text-grayLuxury">Chargement des reservations...</Card> : null}

      {error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm text-rose-200">{error}</p>
          <div className="mt-4">
            <Button variant="ghost" onClick={loadBookings}>
              <RefreshCcw className="h-4 w-4" /> Reessayer
            </Button>
          </div>
        </Card>
      ) : null}

      {actionError ? (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">{actionError}</Card>
      ) : null}

      {!loading && !error ? (
        <Card className="space-y-3">
          <p className="text-sm text-grayLuxury">{filtered.length} reservation(s) trouvee(s).</p>

          {filtered.length === 0 ? (
            <EmptyState
              title="Aucune reservation"
              description="Aucune demande ne correspond a vos filtres. Ajustez les criteres de recherche."
            />
          ) : null}

          {filtered.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto xl:block">
                <table className="w-full min-w-[1180px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-[0.12em] text-grayLuxury">
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Evenement</th>
                      <th className="pb-3">Date evenement</th>
                      <th className="pb-3">Ville</th>
                      <th className="pb-3">Budget</th>
                      <th className="pb-3">Statut</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((booking) => (
                      <tr key={booking.id} className="border-b border-white/5">
                        <td className="py-3">
                          <p className="font-semibold text-offWhite">{booking.fullName}</p>
                          <p className="text-xs text-grayLuxury">{booking.email}</p>
                          <p className="text-xs text-grayLuxury">{booking.phone}</p>
                        </td>
                        <td className="py-3 text-gray-200">{fromApiEventType(booking.eventType)}</td>
                        <td className="py-3 text-gray-200">{formatDate(booking.eventDate)}</td>
                        <td className="py-3 text-gray-200">{booking.city}</td>
                        <td className="py-3 text-gray-200">{booking.budget}</td>
                        <td className="py-3">
                          <Select
                            value={booking.status}
                            onChange={(event) => changeStatus(booking.id, event.target.value as BookingStatus)}
                            className="h-9 py-1"
                          >
                            {BOOKING_STATUS_OPTIONS.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </Select>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openBookingDetails(booking.id)}>
                              Details
                            </Button>
                            <Button asChild variant="secondary" size="sm">
                              <a href={buildClientWhatsappUrl(booking)} target="_blank" rel="noreferrer">
                                <MessageCircleMore className="h-4 w-4" /> Client
                              </a>
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => setBookingToDelete(booking)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 xl:hidden">
                {filtered.map((booking) => (
                  <div key={booking.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-offWhite">{booking.fullName}</p>
                        <p className="text-xs text-grayLuxury">{booking.email}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <p className="mt-2 text-sm text-gray-200">{fromApiEventType(booking.eventType)}</p>
                    <p className="text-xs text-grayLuxury">
                      {formatDate(booking.eventDate)} - {booking.city}
                    </p>
                    <p className="text-xs text-grayLuxury">Budget: {booking.budget}</p>

                    <div className="mt-3">
                      <Select
                        value={booking.status}
                        onChange={(event) => changeStatus(booking.id, event.target.value as BookingStatus)}
                      >
                        {BOOKING_STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openBookingDetails(booking.id)}>
                        Details
                      </Button>
                      <Button asChild variant="secondary" size="sm">
                        <a href={buildClientWhatsappUrl(booking)} target="_blank" rel="noreferrer">
                          <MessageCircleMore className="h-4 w-4" /> Client
                        </a>
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setBookingToDelete(booking)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </Card>
      ) : null}

      <Modal
        open={Boolean(selectedBookingId)}
        title={selectedBooking ? `Reservation ${selectedBooking.reference}` : 'Details reservation'}
        onClose={closeDetails}
      >
        {detailLoading ? <p className="text-sm text-grayLuxury">Chargement des details...</p> : null}

        {!detailLoading && selectedBooking ? (
          <div className="space-y-3 text-sm">
            <p className="text-grayLuxury">Client</p>
            <p className="text-offWhite">{selectedBooking.fullName}</p>
            <p className="text-offWhite">
              {selectedBooking.email} - {selectedBooking.phone}
            </p>

            <p className="text-grayLuxury">Informations evenement</p>
            <p className="text-offWhite">Type: {fromApiEventType(selectedBooking.eventType)}</p>
            <p className="text-offWhite">Date: {formatDate(selectedBooking.eventDate)}</p>
            <p className="text-offWhite">
              Lieu: {selectedBooking.location} - {selectedBooking.city}
            </p>
            <p className="text-offWhite">Invites: {selectedBooking.guestsCount}</p>

            <p className="text-grayLuxury">Budget</p>
            <p className="text-offWhite">{selectedBooking.budget}</p>

            <p className="text-grayLuxury">Services</p>
            <p className="text-offWhite">{selectedBooking.requestedServices.join(', ')}</p>

            <p className="text-grayLuxury">Prestataire prefere</p>
            <p className="text-offWhite">{selectedBooking.preferredProviderName || '-'}</p>

            <p className="text-grayLuxury">Message</p>
            <p className="text-offWhite">{selectedBooking.message || '-'}</p>

            <p className="text-grayLuxury">Statut</p>
            <p className="text-offWhite">{fromApiBookingStatus(selectedBooking.status)}</p>

            <p className="text-grayLuxury">Note admin</p>
            <Textarea
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder="Ajouter une note interne..."
            />
            <div>
              <Button type="button" size="sm" onClick={saveAdminNote} disabled={savingNote || !noteDraft.trim()}>
                {savingNote ? 'Sauvegarde...' : 'Sauvegarder la note'}
              </Button>
            </div>

            <p className="text-xs text-grayLuxury">Cree le {formatDateTime(selectedBooking.createdAt)}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild variant="secondary" size="sm">
                <a href={buildClientWhatsappUrl(selectedBooking)} target="_blank" rel="noreferrer">
                  <MessageCircleMore className="h-4 w-4" /> Contacter le client sur WhatsApp
                </a>
              </Button>
              <Button variant="danger" size="sm" onClick={() => setBookingToDelete(selectedBooking)}>
                <Trash2 className="h-4 w-4" /> Supprimer
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmModal
        open={Boolean(bookingToDelete)}
        title="Supprimer la reservation"
        description="Cette action est irreversible. Voulez-vous vraiment supprimer cette reservation ?"
        confirmLabel="Supprimer"
        danger
        onCancel={() => setBookingToDelete(null)}
        onConfirm={confirmDeleteBooking}
      />
    </div>
  );
};
