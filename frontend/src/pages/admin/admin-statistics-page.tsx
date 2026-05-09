import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { BUDGET_OPTIONS, BUDGET_TO_VALUE } from '../../data/constants';
import { getAllBookings } from '../../services/bookingApi';
import type { BookingResponse } from '../../types/booking';
import { formatCurrency } from '../../utils/format';
import { StatCard } from '../../components/ui/stat-card';
import { BarList } from '../../components/dashboard/bar-list';
import { Card } from '../../components/ui/card';
import { fromApiBookingStatus, fromApiEventType } from '../../utils/booking';

const findClosestBudgetCategory = (average: number) => {
  const entries = Object.entries(BUDGET_TO_VALUE).filter(([, value]) => value > 0);
  if (!entries.length) return BUDGET_OPTIONS[BUDGET_OPTIONS.length - 1];

  return entries.reduce((closest, current) => {
    const closestDiff = Math.abs(closest[1] - average);
    const currentDiff = Math.abs(current[1] - average);
    return currentDiff < closestDiff ? current : closest;
  })[0];
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | string | undefined;
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
      return payload.message;
    }
  }
  return 'Impossible de charger les statistiques pour le moment.';
};

export const AdminStatisticsPage = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllBookings();
        if (!active) return;
        setBookings(data);
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBookings();
    return () => {
      active = false;
    };
  }, []);

  const byStatus = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach((booking) => {
      const label = fromApiBookingStatus(booking.status);
      map.set(label, (map.get(label) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [bookings]);

  const byEventType = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach((booking) => {
      const label = fromApiEventType(booking.eventType);
      map.set(label, (map.get(label) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [bookings]);

  const byCity = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach((booking) => {
      map.set(booking.city, (map.get(booking.city) ?? 0) + 1);
    });

    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [bookings]);

  const serviceDemand = useMemo(() => {
    const map = new Map<string, number>();

    bookings.forEach((booking) => {
      booking.requestedServices.forEach((service) => {
        map.set(service, (map.get(service) ?? 0) + 1);
      });
    });

    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [bookings]);

  const averageBudgetValue = useMemo(() => {
    const values = bookings
      .map((booking) => BUDGET_TO_VALUE[booking.budget] ?? 0)
      .filter((value) => value > 0);

    if (values.length === 0) return 0;

    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }, [bookings]);

  const averageBudgetCategory = averageBudgetValue
    ? findClosestBudgetCategory(averageBudgetValue)
    : 'Aucune donnee';

  const topEventType = byEventType[0]?.label ?? 'Aucune donnee';
  const topService = serviceDemand[0]?.label ?? 'Aucune donnee';

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl text-offWhite sm:text-4xl">Statistiques avancees</h1>
        <p className="mt-2 text-sm text-grayLuxury">Analyse complete de la performance operationnelle et commerciale.</p>
      </section>

      {loading ? <Card className="p-6 text-sm text-grayLuxury">Chargement des statistiques...</Card> : null}
      {error ? <Card className="border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">{error}</Card> : null}

      {!loading && !error ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Type le plus demande" value={topEventType} subtitle="Volume reservations" />
            <StatCard title="Service le plus demande" value={topService} subtitle="Preference client" />
            <StatCard title="Budget moyen estime" value={formatCurrency(averageBudgetValue)} subtitle="Valeur moyenne" />
            <StatCard title="Categorie budget moyenne" value={averageBudgetCategory} subtitle="Segment dominant" />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <BarList title="Reservations par statut" items={byStatus} tone="gold" />
            <BarList title="Reservations par type d'evenement" items={byEventType} tone="purple" />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <BarList title="Reservations par ville" items={byCity} tone="gold" />
            <BarList title="Services les plus demandes" items={serviceDemand} tone="purple" />
          </section>
        </>
      ) : null}
    </div>
  );
};

