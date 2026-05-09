import { useEffect, useMemo, useState } from 'react';
import { Eye, RefreshCcw } from 'lucide-react';
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
      setError(getErrorMessage(err, 'Impossible de charger la liste clients.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const rows = useMemo(
    () =>
      clients.map((client) => {
        const clientBookings = bookings.filter((booking) => booking.clientId === client.id);
        const totalBookings = clientBookings.length;
        const lastBooking = clientBookings[0] ?? null;

        return {
          client,
          totalBookings,
          lastBookingDate: lastBooking ? formatDateTime(lastBooking.createdAt) : '-',
        };
      }),
    [clients, bookings],
  );

  const handleToggleClientActive = async (client: AdminClientResponse) => {
    setActionError(null);
    try {
      const updated = await updateClientActive(client.id, !client.active);
      setClients((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedClient((current) => (current?.id === updated.id ? updated : current));
    } catch (err) {
      setActionError(getErrorMessage(err, "Impossible de modifier le statut du client."));
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
      setActionError(getErrorMessage(err, 'Impossible de charger les details client.'));
      setSelectedClient(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Clients enregistres" description="Suivi des comptes, volume reservations et activite recente." />

      {loading ? <Card className="p-6 text-sm text-grayLuxury">Chargement des clients...</Card> : null}

      {error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm text-rose-200">{error}</p>
          <div className="mt-4">
            <Button variant="ghost" onClick={loadData}>
              <RefreshCcw className="h-4 w-4" /> Reessayer
            </Button>
          </div>
        </Card>
      ) : null}

      {actionError ? (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">{actionError}</Card>
      ) : null}

      {!loading && !error ? (
        rows.length === 0 ? (
          <EmptyState title="Aucun client" description="Aucun compte client n'est enregistre pour le moment." />
        ) : (
          <Card>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1080px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.12em] text-grayLuxury">
                    <th className="pb-3">Nom</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Telephone</th>
                    <th className="pb-3">Ville</th>
                    <th className="pb-3">Date inscription</th>
                    <th className="pb-3">Nombre reservations</th>
                    <th className="pb-3">Derniere reservation</th>
                    <th className="pb-3">Statut</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ client, totalBookings, lastBookingDate }) => (
                    <tr key={client.id} className="border-b border-white/5">
                      <td className="py-3 font-semibold text-offWhite">{client.fullName}</td>
                      <td className="py-3 text-gray-200">{client.email}</td>
                      <td className="py-3 text-gray-200">{client.phone}</td>
                      <td className="py-3 text-gray-200">{client.city || '-'}</td>
                      <td className="py-3 text-grayLuxury">{formatDateTime(client.createdAt)}</td>
                      <td className="py-3 text-gray-200">{totalBookings}</td>
                      <td className="py-3 text-gray-200">{lastBookingDate}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            client.active ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
                          }`}
                        >
                          {client.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleToggleClientActive(client)}>
                            {client.active ? 'Desactiver' : 'Activer'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openClientDetails(client.id)}>
                            <Eye className="h-4 w-4" /> Details
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
                  <p className="text-sm text-gray-200">Ville: {client.city || '-'}</p>
                  <p className="mt-2 text-xs text-grayLuxury">Inscrit le {formatDateTime(client.createdAt)}</p>
                  <p className="text-xs text-grayLuxury">
                    {totalBookings} reservation(s) - derniere: {lastBookingDate}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleToggleClientActive(client)}>
                      {client.active ? 'Desactiver' : 'Activer'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openClientDetails(client.id)}>
                      <Eye className="h-4 w-4" /> Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      ) : null}

      <Modal open={detailsOpen} title="Details client" onClose={() => setDetailsOpen(false)}>
        {detailsLoading ? <p className="text-sm text-grayLuxury">Chargement...</p> : null}

        {!detailsLoading && selectedClient ? (
          <div className="space-y-2 text-sm text-gray-200">
            <p>
              <span className="text-grayLuxury">Nom:</span> {selectedClient.fullName}
            </p>
            <p>
              <span className="text-grayLuxury">Email:</span> {selectedClient.email}
            </p>
            <p>
              <span className="text-grayLuxury">Telephone:</span> {selectedClient.phone}
            </p>
            <p>
              <span className="text-grayLuxury">Ville:</span> {selectedClient.city || '-'}
            </p>
            <p>
              <span className="text-grayLuxury">Role:</span> {selectedClient.role}
            </p>
            <p>
              <span className="text-grayLuxury">Statut:</span> {selectedClient.active ? 'Actif' : 'Inactif'}
            </p>
            <p>
              <span className="text-grayLuxury">Creation:</span> {formatDateTime(selectedClient.createdAt)}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

