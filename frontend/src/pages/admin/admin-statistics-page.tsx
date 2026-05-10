import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { BUDGET_OPTIONS, BUDGET_TO_VALUE } from '../../data/constants';
import { getAllBookings } from '../../services/bookingApi';
import type { BookingResponse } from '../../types/booking';
import { formatCurrency } from '../../utils/format';
import { StatCard } from '../../components/ui/stat-card';
import { BarList } from '../../components/dashboard/bar-list';
import { Card } from '../../components/ui/card';
import {
  getBookingStatusLabel,
  getBudgetLabel,
  getEventTypeLabel,
  getServiceLabel,
} from '../../utils/translationLabels';

const findClosestBudgetCategory = (average: number) => {
  const entries = Object.entries(BUDGET_TO_VALUE).filter(([, value]) => value > 0);
  if (!entries.length) return BUDGET_OPTIONS[BUDGET_OPTIONS.length - 1];

  return entries.reduce((closest, current) => {
    const closestDiff = Math.abs(closest[1] - average);
    const currentDiff = Math.abs(current[1] - average);
    return currentDiff < closestDiff ? current : closest;
  })[0];
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

export const AdminStatisticsPage = () => {
  const { t } = useTranslation();
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
        setError(getErrorMessage(err, t('admin.statistics.errors.loadStatistics')));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadBookings();
    return () => {
      active = false;
    };
  }, [t]);

  const byStatus = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach((booking) => {
      const label = getBookingStatusLabel(booking.status, t);
      map.set(label, (map.get(label) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [bookings, t]);

  const byEventType = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach((booking) => {
      const label = getEventTypeLabel(booking.eventType, t);
      map.set(label, (map.get(label) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [bookings, t]);

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
        const label = getServiceLabel(service, t);
        map.set(label, (map.get(label) ?? 0) + 1);
      });
    });

    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [bookings, t]);

  const averageBudgetValue = useMemo(() => {
    const values = bookings
      .map((booking) => BUDGET_TO_VALUE[booking.budget] ?? 0)
      .filter((value) => value > 0);

    if (values.length === 0) return 0;

    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }, [bookings]);

  const averageBudgetCategory = averageBudgetValue
    ? getBudgetLabel(findClosestBudgetCategory(averageBudgetValue), t)
    : t('admin.common.noData');

  const topEventType = byEventType[0]?.label ?? t('admin.common.noData');
  const topService = serviceDemand[0]?.label ?? t('admin.common.noData');

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl text-offWhite sm:text-4xl">{t('admin.statistics.header.title')}</h1>
        <p className="mt-2 text-sm text-grayLuxury">{t('admin.statistics.header.description')}</p>
      </section>

      {loading ? <Card className="p-6 text-sm text-grayLuxury">{t('admin.statistics.loading')}</Card> : null}
      {error ? <Card className="border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">{error}</Card> : null}

      {!loading && !error ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title={t('admin.statistics.stats.topEventType.title')} value={topEventType} subtitle={t('admin.statistics.stats.topEventType.subtitle')} />
            <StatCard title={t('admin.statistics.stats.topService.title')} value={topService} subtitle={t('admin.statistics.stats.topService.subtitle')} />
            <StatCard title={t('admin.statistics.stats.averageBudget.title')} value={formatCurrency(averageBudgetValue)} subtitle={t('admin.statistics.stats.averageBudget.subtitle')} />
            <StatCard title={t('admin.statistics.stats.averageBudgetCategory.title')} value={averageBudgetCategory} subtitle={t('admin.statistics.stats.averageBudgetCategory.subtitle')} />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <BarList title={t('admin.statistics.charts.byStatus')} items={byStatus} tone="gold" />
            <BarList title={t('admin.statistics.charts.byEventType')} items={byEventType} tone="purple" />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <BarList title={t('admin.statistics.charts.byCity')} items={byCity} tone="gold" />
            <BarList title={t('admin.statistics.charts.topServices')} items={serviceDemand} tone="purple" />
          </section>
        </>
      ) : null}
    </div>
  );
};
