import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CalendarCheck2, Crown, Settings2, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getDashboardStats } from '../../services/adminApi';
import type { DashboardStatsResponse } from '../../types/admin';
import { StatCard } from '../../components/ui/stat-card';
import { BarList } from '../../components/dashboard/bar-list';
import { RecentBookingsTable } from '../../components/dashboard/recent-bookings-table';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { getBookingStatusLabel, getEventTypeLabel } from '../../utils/translationLabels';

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

const emptyStats: DashboardStatsResponse = {
  totalBookings: 0,
  newBookings: 0,
  inProgressBookings: 0,
  confirmedBookings: 0,
  cancelledBookings: 0,
  totalClients: 0,
  totalProviders: 0,
  mostRequestedEventType: 'NONE',
  bookingsByStatus: {},
  bookingsByEventType: {},
  latestBookings: [],
};

export const AdminDashboardPage = () => {
  const { t } = useTranslation();
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
        setError(getErrorMessage(err, t('admin.dashboard.errors.loadStats')));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadStats();

    return () => {
      active = false;
    };
  }, [t]);

  const eventTypeItems = useMemo(
    () =>
      Object.entries(stats.bookingsByEventType)
        .map(([label, value]) => ({ label: getEventTypeLabel(label, t), value }))
        .sort((a, b) => b.value - a.value),
    [stats.bookingsByEventType, t]
  );

  const statusItems = useMemo(
    () =>
      Object.entries(stats.bookingsByStatus)
        .map(([label, value]) => ({ label: getBookingStatusLabel(label, t), value }))
        .sort((a, b) => b.value - a.value),
    [stats.bookingsByStatus, t]
  );

  const mostRequestedEventType =
    stats.mostRequestedEventType && stats.mostRequestedEventType !== 'NONE'
      ? getEventTypeLabel(stats.mostRequestedEventType, t)
      : t('admin.common.noData');

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-cardLuxury/75 p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-16 top-8 h-52 w-52 rounded-full bg-purpleLuxury/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-goldLuxury/15 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">{t('admin.dashboard.hero.kicker')}</p>
            <h1 className="mt-3 font-display text-3xl text-offWhite sm:text-4xl">{t('admin.dashboard.hero.title')}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-200">
              {t('admin.dashboard.hero.subtitle')}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-grayLuxury">{t('admin.dashboard.hero.totalBookings')}</p>
            <p className="mt-2 font-display text-3xl text-offWhite">{stats.totalBookings}</p>
          </div>
        </div>
      </section>

      {loading ? <Card className="p-6 text-sm text-grayLuxury">{t('admin.dashboard.loading')}</Card> : null}

      {error ? (
        <Card className="border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">{error}</Card>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title={t('admin.dashboard.stats.totalBookings.title')} value={stats.totalBookings} subtitle={t('admin.dashboard.stats.totalBookings.subtitle')} />
        <StatCard title={t('admin.dashboard.stats.newBookings.title')} value={stats.newBookings} subtitle={t('admin.dashboard.stats.newBookings.subtitle')} />
        <StatCard title={t('admin.dashboard.stats.inProgressBookings.title')} value={stats.inProgressBookings} subtitle={t('admin.dashboard.stats.inProgressBookings.subtitle')} />
        <StatCard title={t('admin.dashboard.stats.confirmedBookings.title')} value={stats.confirmedBookings} subtitle={t('admin.dashboard.stats.confirmedBookings.subtitle')} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title={t('admin.dashboard.stats.cancelledBookings.title')} value={stats.cancelledBookings} subtitle={t('admin.dashboard.stats.cancelledBookings.subtitle')} />
        <StatCard title={t('admin.dashboard.stats.totalClients.title')} value={stats.totalClients} subtitle={t('admin.dashboard.stats.totalClients.subtitle')} />
        <StatCard title={t('admin.dashboard.stats.totalProviders.title')} value={stats.totalProviders} subtitle={t('admin.dashboard.stats.totalProviders.subtitle')} />
        <StatCard title={t('admin.dashboard.stats.topEventType.title')} value={mostRequestedEventType} subtitle={t('admin.dashboard.stats.topEventType.subtitle')} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <RecentBookingsTable bookings={stats.latestBookings} />

        <Card className="p-6">
          <h3 className="font-display text-2xl text-offWhite">{t('admin.dashboard.quickActions.title')}</h3>
          <p className="mt-2 text-sm text-grayLuxury">{t('admin.dashboard.quickActions.subtitle')}</p>

          <div className="mt-5 space-y-3">
            <Button asChild fullWidth>
              <Link to="/admin/bookings">
                <CalendarCheck2 className="h-4 w-4" /> {t('admin.dashboard.quickActions.manageBookings')}
              </Link>
            </Button>
            <Button asChild variant="ghost" fullWidth>
              <Link to="/admin/clients">
                <Users className="h-4 w-4" /> {t('admin.dashboard.quickActions.manageClients')}
              </Link>
            </Button>
            <Button asChild variant="ghost" fullWidth>
              <Link to="/admin/statistics">
                <BarChart3 className="h-4 w-4" /> {t('admin.dashboard.quickActions.viewStatistics')}
              </Link>
            </Button>
            <Button asChild variant="secondary" fullWidth>
              <Link to="/admin/settings">
                <Settings2 className="h-4 w-4" /> {t('admin.dashboard.quickActions.agencySettings')}
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-grayLuxury">
            <p className="inline-flex items-center gap-1 text-goldLuxury">
              <Crown className="h-4 w-4" /> {t('admin.dashboard.insight.title')}
            </p>
            <p className="mt-2 text-gray-200">
              {mostRequestedEventType !== t('admin.common.noData')
                ? t('admin.dashboard.insight.hasTrend', { eventType: mostRequestedEventType })
                : t('admin.dashboard.insight.noTrend')}
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <BarList title={t('admin.dashboard.charts.byStatus')} items={statusItems} tone="gold" />
        <BarList title={t('admin.dashboard.charts.byEventType')} items={eventTypeItems} tone="purple" />
      </section>
    </div>
  );
};
