import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, CalendarPlus, CircleCheckBig, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../hooks/use-auth';
import { getMyBookings } from '../../services/bookingApi';
import type { BookingResponse } from '../../types/booking';
import { StatCard } from '../../components/ui/stat-card';
import { Card } from '../../components/ui/card';
import { StatusBadge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { formatDate, formatDateTime } from '../../utils/format';
import { fromApiEventType } from '../../utils/booking';

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | string | undefined;
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
      return payload.message;
    }
  }
  return 'Impossible de charger votre dashboard pour le moment.';
};

export const ClientDashboardPage = () => {
  const { client } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyBookings();
        if (!active) return;
        setBookings(data);
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      active = false;
    };
  }, []);

  const pendingBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status === 'NOUVELLE_DEMANDE' ||
          booking.status === 'EN_COURS' ||
          booking.status === 'OFFRE_ENVOYEE',
      ).length,
    [bookings],
  );
  const confirmedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === 'CONFIRMEE').length,
    [bookings],
  );
  const lastBooking = bookings[0] ?? null;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-cardLuxury/70 p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-12 top-8 h-44 w-44 rounded-full bg-purpleLuxury/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-44 w-44 rounded-full bg-goldLuxury/15 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Espace personnel</p>
            <h1 className="mt-3 font-display text-3xl text-offWhite sm:text-4xl">Bienvenue {client?.fullName}</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-200">
              Suivez vos reservations, vos statuts et vos prochaines etapes depuis un seul tableau de bord.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/client/new-booking">
                <CalendarPlus className="h-4 w-4" /> Nouvelle reservation
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/client/bookings">
                <CalendarClock className="h-4 w-4" /> Mes reservations
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total reservations" value={bookings.length} subtitle="Historique complet" />
        <StatCard title="Demandes en cours" value={pendingBookings} subtitle="En attente de validation finale" />
        <StatCard title="Reservations confirmees" value={confirmedBookings} subtitle="Evenements valides" />
        <StatCard
          title="Derniere reservation"
          value={lastBooking ? formatDate(lastBooking.createdAt) : 'Aucune'}
          subtitle={lastBooking ? fromApiEventType(lastBooking.eventType) : 'Aucune activite'}
        />
      </section>

      {loading ? (
        <Card className="p-6 text-sm text-grayLuxury">Chargement de vos reservations...</Card>
      ) : null}

      {error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">
          {error}
        </Card>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl text-offWhite">Derniere reservation</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/client/bookings">Voir tout</Link>
            </Button>
          </div>

          {!loading && !error && lastBooking ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-black/30 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-2xl text-offWhite">{fromApiEventType(lastBooking.eventType)}</p>
                <StatusBadge status={lastBooking.status} />
              </div>
              <p className="mt-2 text-sm text-gray-200">
                {lastBooking.location} - {lastBooking.city}
              </p>
              <div className="mt-4 grid gap-2 text-sm text-grayLuxury sm:grid-cols-2">
                <p>Date evenement: {formatDate(lastBooking.eventDate)}</p>
                <p>Cree le: {formatDateTime(lastBooking.createdAt)}</p>
                <p>Budget: {lastBooking.budget}</p>
                <p>Invites: {lastBooking.guestsCount}</p>
              </div>
            </motion.div>
          ) : null}

          {!loading && !error && !lastBooking ? (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-grayLuxury">
              Aucune reservation pour le moment.
            </div>
          ) : null}
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-offWhite">Actions rapides</h2>
          <p className="mt-2 text-sm text-grayLuxury">Gardez le rythme avec ces raccourcis.</p>

          <div className="mt-5 space-y-3">
            <Button asChild fullWidth>
              <Link to="/client/new-booking">
                <CalendarPlus className="h-4 w-4" /> Nouvelle reservation
              </Link>
            </Button>
            <Button asChild variant="ghost" fullWidth>
              <Link to="/client/bookings">
                <CalendarClock className="h-4 w-4" /> Mes reservations
              </Link>
            </Button>
            <Button asChild variant="secondary" fullWidth>
              <Link to="/client/profile">
                <CircleCheckBig className="h-4 w-4" /> Mettre a jour mon profil
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-200">
            <p className="inline-flex items-center gap-1 text-goldLuxury">
              <Sparkles className="h-4 w-4" /> Conseil Bouri
            </p>
            <p className="mt-2 text-grayLuxury">
              Plus votre brief est detaille, plus notre proposition sera precise des la premiere offre.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};

