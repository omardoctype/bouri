import { useEffect, useMemo, useState } from 'react';
import { Eye, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getAllBookings } from '../../services/bookingApi';
import { getClient, getClients, updateClientActive } from '../../services/adminApi';
import type { AdminClientResponse } from '../../types/admin';
import type { BookingResponse } from '../../types/booking';
import { Card } from '../../components/ui/card';
import { EmptyState } from '../../components/ui/empty-state';
import { PageHeader } from '../../components/ui/page-header';
import { formatDateTime } from '../../utils/format';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/modal';

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

export const AdminClientsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');

  const [clients, setClients] = useState<AdminClientResponse[]>([]);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<AdminClientResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    setActionError(null);

    try {
      const [clientsData, bookingsData] = await Promise.all([getClients(), getAllBookings()]);
      setClients(clientsData);
      setBookings(bookingsData);
    } catch (err) {
      setError(getErrorMessage(err, t('admin.clients.errors.loadClients')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [t]);

  const rows = useMemo(
    () =>
      clients.map((client) => {
        const clientBookings = bookings.filter((booking) => booking.clientId === client.id);
        const totalBookings = clientBookings.length;
        const lastBooking = clientBookings[0] ?? null;

        return {
          client,
          totalBookings,
          lastBookingDate: lastBooking ? formatDateTime(lastBooking.createdAt) : t('admin.common.none'),
        };
      }),
    [clients, bookings, t]
  );

  const handleToggleClientActive = async (client: AdminClientResponse) => {
    setActionError(null);
    try {
      const updated = await updateClientActive(client.id, !client.active);
      setClients((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedClient((current) => (current?.id === updated.id ? updated : current));
    } catch (err) {
      setActionError(getErrorMessage(err, t('admin.clients.errors.toggleStatus')));
    }
  };

  const openClientDetails = async (clientId: number) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    setActionError(null);
    try {
      const details = await getClient(clientId);
      setSelectedClient(details);
    } catch (err) {
      setActionError(getErrorMessage(err, t('admin.clients.errors.loadClientDetails')));
      setSelectedClient(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('admin.clients.header.title')} description={t('admin.clients.header.description')} />

      {loading ? <Card className="p-6 text-sm text-grayLuxury">{t('admin.clients.loading')}</Card> : null}

      {error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm text-rose-200">{error}</p>
          <div className="mt-4">
            <Button variant="ghost" onClick={loadData}>
              <RefreshCcw className="h-4 w-4" /> {t('admin.common.retry')}
            </Button>
          </div>
        </Card>
      ) : null}

      {actionError ? (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">{actionError}</Card>
      ) : null}

      {!loading && !error ? (
        rows.length === 0 ? (
          <EmptyState title={t('admin.clients.empty.title')} description={t('admin.clients.empty.description')} />
        ) : (
          <Card>
            <div className="hidden overflow-x-auto xl:block">
              <table className={`w-full min-w-[1080px] text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.12em] text-grayLuxury">
                    <th className="pb-3">{t('admin.clients.columns.name')}</th>
                    <th className="pb-3">{t('admin.clients.columns.email')}</th>
                    <th className="pb-3">{t('admin.clients.columns.phone')}</th>
                    <th className="pb-3">{t('admin.clients.columns.city')}</th>
                    <th className="pb-3">{t('admin.clients.columns.registeredAt')}</th>
                    <th className="pb-3">{t('admin.clients.columns.bookingsCount')}</th>
                    <th className="pb-3">{t('admin.clients.columns.lastBooking')}</th>
                    <th className="pb-3">{t('admin.clients.columns.status')}</th>
                    <th className="pb-3">{t('admin.clients.columns.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ client, totalBookings, lastBookingDate }) => (
                    <tr key={client.id} className="border-b border-white/5">
                      <td className="py-3 font-semibold text-offWhite">{client.fullName}</td>
                      <td className="py-3 text-gray-200">{client.email}</td>
                      <td className="py-3 text-gray-200">{client.phone}</td>
                      <td className="py-3 text-gray-200">{client.city || t('admin.common.none')}</td>
                      <td className="py-3 text-grayLuxury">{formatDateTime(client.createdAt)}</td>
                      <td className="py-3 text-gray-200">{totalBookings}</td>
                      <td className="py-3 text-gray-200">{lastBookingDate}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            client.active ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
                          }`}
                        >
                          {client.active ? t('admin.clients.status.active') : t('admin.clients.status.inactive')}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleToggleClientActive(client)}>
                            {client.active ? t('admin.clients.actions.deactivate') : t('admin.clients.actions.activate')}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openClientDetails(client.id)}>
                            <Eye className="h-4 w-4" /> {t('admin.common.details')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 xl:hidden">
              {rows.map(({ client, totalBookings, lastBookingDate }) => (
                <div key={client.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold text-offWhite">{client.fullName}</h3>
                  <p className="text-sm text-gray-200">{client.email}</p>
                  <p className="text-sm text-gray-200">{client.phone}</p>
                  <p className="text-sm text-gray-200">
                    {t('admin.clients.columns.city')}: {client.city || t('admin.common.none')}
                  </p>
                  <p className="mt-2 text-xs text-grayLuxury">
                    {t('admin.clients.mobile.registeredAt', { date: formatDateTime(client.createdAt) })}
                  </p>
                  <p className="text-xs text-grayLuxury">
                    {t('admin.clients.mobile.bookingsSummary', { count: totalBookings, last: lastBookingDate })}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleToggleClientActive(client)}>
                      {client.active ? t('admin.clients.actions.deactivate') : t('admin.clients.actions.activate')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openClientDetails(client.id)}>
                      <Eye className="h-4 w-4" /> {t('admin.common.details')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      ) : null}

      <Modal open={detailsOpen} title={t('admin.clients.modal.title')} onClose={() => setDetailsOpen(false)}>
        {detailsLoading ? <p className="text-sm text-grayLuxury">{t('admin.common.loading')}</p> : null}

        {!detailsLoading && selectedClient ? (
          <div className="space-y-2 text-sm text-gray-200">
            <p>
              <span className="text-grayLuxury">{t('admin.clients.modal.fields.name')}:</span> {selectedClient.fullName}
            </p>
            <p>
              <span className="text-grayLuxury">{t('admin.clients.modal.fields.email')}:</span> {selectedClient.email}
            </p>
            <p>
              <span className="text-grayLuxury">{t('admin.clients.modal.fields.phone')}:</span> {selectedClient.phone}
            </p>
            <p>
              <span className="text-grayLuxury">{t('admin.clients.modal.fields.city')}:</span> {selectedClient.city || t('admin.common.none')}
            </p>
            <p>
              <span className="text-grayLuxury">{t('admin.clients.modal.fields.role')}:</span> {selectedClient.role}
            </p>
            <p>
              <span className="text-grayLuxury">{t('admin.clients.modal.fields.status')}:</span>{' '}
              {selectedClient.active ? t('admin.clients.status.active') : t('admin.clients.status.inactive')}
            </p>
            <p>
              <span className="text-grayLuxury">{t('admin.clients.modal.fields.createdAt')}:</span>{' '}
              {formatDateTime(selectedClient.createdAt)}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
