import { useEffect, useMemo, useState } from 'react';
import { MessageCircleMore, RefreshCcw, Search, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { BOOKING_STATUS_OPTIONS, EVENT_TYPE_OPTIONS } from '../../utils/booking';
import { Textarea } from '../../components/ui/textarea';
import {
  getBookingStatusLabel,
  getBudgetLabel,
  getEventTypeLabel,
  getServiceLabel,
} from '../../utils/translationLabels';

const SORT_OPTIONS = ['newest', 'oldest', 'eventDate'] as const;

type SortValue = (typeof SORT_OPTIONS)[number];

const sanitizePhone = (value: string) => value.replace(/[^\d]/g, '');

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
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');

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

  const buildClientWhatsappUrl = (booking: BookingResponse) => {
    const phone = sanitizePhone(booking.phone);
    if (!phone) return '';
    const message = encodeURIComponent(
      t('admin.bookings.whatsappMessage', { fullName: booking.fullName, reference: booking.reference }),
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const getSortLabel = (value: SortValue) => {
    if (value === 'oldest') return t('admin.bookings.filters.sort.oldest');
    if (value === 'eventDate') return t('admin.bookings.filters.sort.eventDate');
    return t('admin.bookings.filters.sort.newest');
  };

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
      setError(getErrorMessage(err, t('admin.bookings.errors.loadBookings')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, [statusFilter, eventFilter, debouncedSearch, t]);

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
      setActionError(getErrorMessage(err, t('admin.bookings.errors.loadBookingDetails')));
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
      setActionError(getErrorMessage(err, t('admin.bookings.errors.updateStatus')));
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
      setActionError(getErrorMessage(err, t('admin.bookings.errors.saveNote')));
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
      setActionError(getErrorMessage(err, t('admin.bookings.errors.deleteBooking')));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.bookings.header.title')}
        description={t('admin.bookings.header.description')}
      />

      <Card>
        <div className="grid gap-3 xl:grid-cols-[1fr_220px_220px_220px_220px]">
          <label className="relative xl:col-span-1">
            <Search className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-grayLuxury ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.bookings.filters.searchPlaceholder')}
              className={isRTL ? 'pr-9' : 'pl-9'}
            />
          </label>

          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'ALL' | BookingStatus)}>
            <option value="ALL">{t('admin.bookings.filters.allStatuses')}</option>
            {BOOKING_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {getBookingStatusLabel(status.value, t)}
              </option>
            ))}
          </Select>

          <Select value={eventFilter} onChange={(event) => setEventFilter(event.target.value as 'ALL' | EventType)}>
            <option value="ALL">{t('admin.bookings.filters.allEvents')}</option>
            {EVENT_TYPE_OPTIONS.map((eventType) => (
              <option key={eventType.value} value={eventType.value}>
                {getEventTypeLabel(eventType.value, t)}
              </option>
            ))}
          </Select>

          <Select value={budgetFilter} onChange={(event) => setBudgetFilter(event.target.value)}>
            <option value="ALL">{t('admin.bookings.filters.allBudgets')}</option>
            {BUDGET_OPTIONS.map((budget) => (
              <option key={budget} value={budget}>
                {getBudgetLabel(budget, t)}
              </option>
            ))}
          </Select>

          <Select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortValue)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t('admin.bookings.filters.sort.prefix')} {getSortLabel(option)}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {loading ? <Card className="p-6 text-sm text-grayLuxury">{t('admin.bookings.loading')}</Card> : null}

      {error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm text-rose-200">{error}</p>
          <div className="mt-4">
            <Button variant="ghost" onClick={loadBookings}>
              <RefreshCcw className="h-4 w-4" /> {t('admin.common.retry')}
            </Button>
          </div>
        </Card>
      ) : null}

      {actionError ? (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">{actionError}</Card>
      ) : null}

      {!loading && !error ? (
        <Card className="space-y-3">
          <p className="text-sm text-grayLuxury">
            {t('admin.bookings.resultCount', { count: filtered.length })}
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              title={t('admin.bookings.empty.title')}
              description={t('admin.bookings.empty.description')}
            />
          ) : null}

          {filtered.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto xl:block">
                <table className={`w-full min-w-[1180px] text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-[0.12em] text-grayLuxury">
                      <th className="pb-3">{t('admin.bookings.columns.client')}</th>
                      <th className="pb-3">{t('admin.bookings.columns.event')}</th>
                      <th className="pb-3">{t('admin.bookings.columns.eventDate')}</th>
                      <th className="pb-3">{t('admin.bookings.columns.city')}</th>
                      <th className="pb-3">{t('admin.bookings.columns.budget')}</th>
                      <th className="pb-3">{t('admin.bookings.columns.status')}</th>
                      <th className="pb-3">{t('admin.bookings.columns.actions')}</th>
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
                        <td className="py-3 text-gray-200">{getEventTypeLabel(booking.eventType, t)}</td>
                        <td className="py-3 text-gray-200">{formatDate(booking.eventDate)}</td>
                        <td className="py-3 text-gray-200">{booking.city}</td>
                        <td className="py-3 text-gray-200">{getBudgetLabel(booking.budget, t)}</td>
                        <td className="py-3">
                          <Select
                            value={booking.status}
                            onChange={(event) => changeStatus(booking.id, event.target.value as BookingStatus)}
                            className="h-9 py-1"
                          >
                            {BOOKING_STATUS_OPTIONS.map((status) => (
                              <option key={status.value} value={status.value}>
                                {getBookingStatusLabel(status.value, t)}
                              </option>
                            ))}
                          </Select>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openBookingDetails(booking.id)}>
                              {t('admin.common.details')}
                            </Button>
                            <Button asChild variant="secondary" size="sm">
                              <a href={buildClientWhatsappUrl(booking)} target="_blank" rel="noreferrer">
                                <MessageCircleMore className="h-4 w-4" /> {t('admin.bookings.actions.client')}
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

                    <p className="mt-2 text-sm text-gray-200">{getEventTypeLabel(booking.eventType, t)}</p>
                    <p className="text-xs text-grayLuxury">
                      {formatDate(booking.eventDate)} - {booking.city}
                    </p>
                    <p className="text-xs text-grayLuxury">
                      {t('admin.bookings.columns.budget')}: {getBudgetLabel(booking.budget, t)}
                    </p>

                    <div className="mt-3">
                      <Select
                        value={booking.status}
                        onChange={(event) => changeStatus(booking.id, event.target.value as BookingStatus)}
                      >
                        {BOOKING_STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {getBookingStatusLabel(status.value, t)}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openBookingDetails(booking.id)}>
                        {t('admin.common.details')}
                      </Button>
                      <Button asChild variant="secondary" size="sm">
                        <a href={buildClientWhatsappUrl(booking)} target="_blank" rel="noreferrer">
                          <MessageCircleMore className="h-4 w-4" /> {t('admin.bookings.actions.client')}
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
        title={
          selectedBooking
            ? t('admin.bookings.modal.title', { reference: selectedBooking.reference })
            : t('admin.bookings.modal.defaultTitle')
        }
        onClose={closeDetails}
      >
        {detailLoading ? <p className="text-sm text-grayLuxury">{t('admin.bookings.modal.loading')}</p> : null}

        {!detailLoading && selectedBooking ? (
          <div className="space-y-3 text-sm">
            <p className="text-grayLuxury">{t('admin.bookings.modal.sections.client')}</p>
            <p className="text-offWhite">{selectedBooking.fullName}</p>
            <p className="text-offWhite">
              {selectedBooking.email} - {selectedBooking.phone}
            </p>

            <p className="text-grayLuxury">{t('admin.bookings.modal.sections.event')}</p>
            <p className="text-offWhite">{t('admin.bookings.modal.fields.type')}: {getEventTypeLabel(selectedBooking.eventType, t)}</p>
            <p className="text-offWhite">{t('admin.bookings.modal.fields.date')}: {formatDate(selectedBooking.eventDate)}</p>
            <p className="text-offWhite">
              {t('admin.bookings.modal.fields.location')}: {selectedBooking.location} - {selectedBooking.city}
            </p>
            <p className="text-offWhite">{t('admin.bookings.modal.fields.guests')}: {selectedBooking.guestsCount}</p>

            <p className="text-grayLuxury">{t('admin.bookings.modal.sections.budget')}</p>
            <p className="text-offWhite">{getBudgetLabel(selectedBooking.budget, t)}</p>

            <p className="text-grayLuxury">{t('admin.bookings.modal.sections.services')}</p>
            <p className="text-offWhite">
              {selectedBooking.requestedServices.length
                ? selectedBooking.requestedServices.map((service) => getServiceLabel(service, t)).join(', ')
                : t('admin.common.noData')}
            </p>

            <p className="text-grayLuxury">{t('admin.bookings.modal.sections.preferredProvider')}</p>
            <p className="text-offWhite">{selectedBooking.preferredProviderName || t('admin.common.none')}</p>

            <p className="text-grayLuxury">{t('admin.bookings.modal.sections.message')}</p>
            <p className="text-offWhite">{selectedBooking.message || t('admin.common.none')}</p>

            <p className="text-grayLuxury">{t('admin.bookings.modal.sections.status')}</p>
            <p className="text-offWhite">{getBookingStatusLabel(selectedBooking.status, t)}</p>

            <p className="text-grayLuxury">{t('admin.bookings.modal.sections.adminNote')}</p>
            <Textarea
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder={t('admin.bookings.modal.notePlaceholder')}
            />
            <div>
              <Button type="button" size="sm" onClick={saveAdminNote} disabled={savingNote || !noteDraft.trim()}>
                {savingNote ? t('admin.bookings.modal.savingNote') : t('admin.bookings.modal.saveNote')}
              </Button>
            </div>

            <p className="text-xs text-grayLuxury">
              {t('admin.bookings.modal.createdAt')}: {formatDateTime(selectedBooking.createdAt)}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild variant="secondary" size="sm">
                <a href={buildClientWhatsappUrl(selectedBooking)} target="_blank" rel="noreferrer">
                  <MessageCircleMore className="h-4 w-4" /> {t('admin.bookings.modal.contactWhatsapp')}
                </a>
              </Button>
              <Button variant="danger" size="sm" onClick={() => setBookingToDelete(selectedBooking)}>
                <Trash2 className="h-4 w-4" /> {t('admin.common.delete')}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmModal
        open={Boolean(bookingToDelete)}
        title={t('admin.bookings.deleteConfirm.title')}
        description={t('admin.bookings.deleteConfirm.description')}
        confirmLabel={t('admin.bookings.deleteConfirm.confirm')}
        cancelLabel={t('admin.common.cancel')}
        danger
        onCancel={() => setBookingToDelete(null)}
        onConfirm={confirmDeleteBooking}
      />
    </div>
  );
};
