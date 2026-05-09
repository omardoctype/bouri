import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CalendarCheck2, Crown, Settings2, Users } from 'lucide-react';
import axios from 'axios';
import { getDashboardStats } from '../../services/adminApi';
import type { DashboardStatsResponse } from '../../types/admin';
import { StatCard } from '../../components/ui/stat-card';
import { BarList } from '../../components/dashboard/bar-list';
import { RecentBookingsTable } from '../../components/dashboard/recent-bookings-table';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { fromApiEventType, fromApiBookingStatus } from '../../utils/booking';

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | string | undefined;
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
      return payload.message;
    }
  }
  return 'Impossible de charger les statistiques admin.';
};

const emptyStats: DashboardStatsResponse = {
  totalBookings: 0,
  newBookings: 0,
  inProgressBookings: 0,
  confirmedBookings: 0,
  cancelledBookings: 0,
  totalClients: 0,
  totalProviders: 0,
  mostRequestedEventType: 'Aucune donnee',
  bookingsByStatus: {},
  bookingsByEventType: {},
  latestBookings: [],
};

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStatsResponse>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardStats();
        if (!active) return;
        setStats(data);
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  const eventTypeItems = useMemo(
    () =>
      Object.entries(stats.bookingsByEventType)
        .map(([label, value]) => ({ label: fromApiEventType(label), value }))
        .sort((a, b) => b.value - a.value),
    [stats.bookingsByEventType],
  );

  const statusItems = useMemo(
    () =>
      Object.entries(stats.bookingsByStatus)
        .map(([label, value]) => ({ label: fromApiBookingStatus(label), value }))
        .sort((a, b) => b.value - a.value),
    [stats.bookingsByStatus],
  );

  const mostRequestedEventType =
    stats.mostRequestedEventType && stats.mostRequestedEventType !== 'NONE'
      ? fromApiEventType(stats.mostRequestedEventType)
      : 'Aucune donnee';

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-cardLuxury/75 p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-16 top-8 h-52 w-52 rounded-full bg-purpleLuxury/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-goldLuxury/15 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Cockpit admin</p>
            <h1 className="mt-3 font-display text-3xl text-offWhite sm:text-4xl">Vue operationnelle Bouri Events</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-200">
              Pilotez les reservations, prestataires et performances de la plateforme depuis ce tableau de bord.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-grayLuxury">Reservations totales</p>
            <p className="mt-2 font-display text-3xl text-offWhite">{stats.totalBookings}</p>
          </div>
        </div>
      </section>

      {loading ? (
        <Card className="p-6 text-sm text-grayLuxury">Chargement des statistiques...</Card>
      ) : null}

      {error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">{error}</Card>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total reservations" value={stats.totalBookings} subtitle="Toutes demandes" />
        <StatCard title="Nouvelles demandes" value={stats.newBookings} subtitle="A traiter" />
        <StatCard title="En cours" value={stats.inProgressBookings} subtitle="Traitement actif" />
        <StatCard title="Confirmees" value={stats.confirmedBookings} subtitle="Evenements valides" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Annulees" value={stats.cancelledBookings} subtitle="Dossiers fermes" />
        <StatCard title="Total clients" value={stats.totalClients} subtitle="Comptes enregistres" />
        <StatCard title="Total prestataires" value={stats.totalProviders} subtitle="Reseau actif" />
        <StatCard title="Type le plus demande" value={mostRequestedEventType} subtitle="Tendance actuelle" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <RecentBookingsTable bookings={stats.latestBookings} />

        <Card className="p-6">
          <h3 className="font-display text-2xl text-offWhite">Actions rapides</h3>
          <p className="mt-2 text-sm text-grayLuxury">Raccourcis utiles pour piloter la plateforme.</p>

          <div className="mt-5 space-y-3">
            <Button asChild fullWidth>
              <Link to="/admin/bookings">
                <CalendarCheck2 className="h-4 w-4" /> Gerer les reservations
              </Link>
            </Button>
            <Button asChild variant="ghost" fullWidth>
              <Link to="/admin/clients">
                <Users className="h-4 w-4" /> Gerer les clients
              </Link>
            </Button>
            <Button asChild variant="ghost" fullWidth>
              <Link to="/admin/statistics">
                <BarChart3 className="h-4 w-4" /> Voir les statistiques
              </Link>
            </Button>
            <Button asChild variant="secondary" fullWidth>
              <Link to="/admin/settings">
                <Settings2 className="h-4 w-4" /> Parametres agence
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-grayLuxury">
            <p className="inline-flex items-center gap-1 text-goldLuxury">
              <Crown className="h-4 w-4" /> Insight premium
            </p>
            <p className="mt-2 text-gray-200">
              {mostRequestedEventType !== 'Aucune donnee'
                ? `${mostRequestedEventType} est actuellement la demande la plus frequente.`
                : 'Aucune tendance disponible pour le moment.'}
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <BarList title="Reservations par statut" items={statusItems} tone="gold" />
        <BarList title="Reservations par type" items={eventTypeItems} tone="purple" />
      </section>
    </div>
  );
};

