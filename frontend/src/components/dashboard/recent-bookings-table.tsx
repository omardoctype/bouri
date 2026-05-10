import { Link } from 'react-router-dom';
import { MessageCircleMore } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BookingResponse } from '../../types/booking';
import { formatDate } from '../../utils/format';
import { StatusBadge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { createWhatsappUrl } from '../../lib/whatsapp';
import { getBudgetLabel, getEventTypeLabel } from '../../utils/translationLabels';

interface RecentBookingsTableProps {
  bookings: BookingResponse[];
  maxRows?: number;
}

export const RecentBookingsTable = ({ bookings, maxRows = 6 }: RecentBookingsTableProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = (i18n.resolvedLanguage ?? i18n.language).startsWith('ar');
  const recent = bookings.slice(0, maxRows);

  return (
    <Card className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-display text-xl text-offWhite">{t('admin.dashboard.recentBookings.title')}</h3>
        <Link to="/admin/bookings" className="text-sm font-semibold text-goldLuxury hover:underline">
          {t('admin.dashboard.recentBookings.viewAll')}
        </Link>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className={`w-full min-w-[760px] text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.1em] text-grayLuxury">
              <th className="pb-3">{t('admin.dashboard.recentBookings.columns.client')}</th>
              <th className="pb-3">{t('admin.dashboard.recentBookings.columns.event')}</th>
              <th className="pb-3">{t('admin.dashboard.recentBookings.columns.date')}</th>
              <th className="pb-3">{t('admin.dashboard.recentBookings.columns.budget')}</th>
              <th className="pb-3">{t('admin.dashboard.recentBookings.columns.status')}</th>
              <th className="pb-3">{t('admin.dashboard.recentBookings.columns.action')}</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((booking) => (
              <tr key={booking.id} className="border-b border-white/5">
                <td className="py-3">
                  <p className="font-semibold text-offWhite">{booking.fullName}</p>
                  <p className="text-xs text-grayLuxury">{booking.city}</p>
                </td>
                <td className="py-3 text-gray-200">{getEventTypeLabel(booking.eventType, t)}</td>
                <td className="py-3 text-gray-200">{formatDate(booking.eventDate)}</td>
                <td className="py-3 text-gray-200">{getBudgetLabel(booking.budget, t)}</td>
                <td className="py-3">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="py-3">
                  <Button asChild variant="ghost" size="sm">
                    <a
                      href={createWhatsappUrl({
                        ...booking,
                        eventType: getEventTypeLabel(booking.eventType, t),
                      })}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircleMore className="h-4 w-4" /> {t('admin.common.whatsapp')}
                    </a>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {recent.map((booking) => (
          <div key={booking.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-semibold text-offWhite">{booking.fullName}</h4>
              <StatusBadge status={booking.status} />
            </div>
            <p className="mt-2 text-sm text-gray-200">{getEventTypeLabel(booking.eventType, t)}</p>
            <p className="text-xs text-grayLuxury">
              {formatDate(booking.eventDate)} - {booking.city}
            </p>
            <div className="mt-3">
              <a
                href={createWhatsappUrl({
                  ...booking,
                  eventType: getEventTypeLabel(booking.eventType, t),
                })}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-goldLuxury"
              >
                <MessageCircleMore className="h-4 w-4" /> {t('admin.dashboard.recentBookings.contact')}
              </a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
