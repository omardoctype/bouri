import { Link } from 'react-router-dom';
import { MessageCircleMore } from 'lucide-react';
import type { BookingResponse } from '../../types/booking';
import { formatDate } from '../../utils/format';
import { StatusBadge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { createWhatsappUrl } from '../../lib/whatsapp';
import { fromApiEventType } from '../../utils/booking';

interface RecentBookingsTableProps {
  bookings: BookingResponse[];
  maxRows?: number;
}

export const RecentBookingsTable = ({ bookings, maxRows = 6 }: RecentBookingsTableProps) => {
  const recent = bookings.slice(0, maxRows);

  return (
    <Card className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-display text-xl text-offWhite">Reservations recentes</h3>
        <Link to="/admin/bookings" className="text-sm font-semibold text-goldLuxury hover:underline">
          Voir tout
        </Link>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.1em] text-grayLuxury">
              <th className="pb-3">Client</th>
              <th className="pb-3">Evenement</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Budget</th>
              <th className="pb-3">Statut</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((booking) => (
              <tr key={booking.id} className="border-b border-white/5">
                <td className="py-3">
                  <p className="font-semibold text-offWhite">{booking.fullName}</p>
                  <p className="text-xs text-grayLuxury">{booking.city}</p>
                </td>
                <td className="py-3 text-gray-200">{fromApiEventType(booking.eventType)}</td>
                <td className="py-3 text-gray-200">{formatDate(booking.eventDate)}</td>
                <td className="py-3 text-gray-200">{booking.budget}</td>
                <td className="py-3">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="py-3">
                  <Button asChild variant="ghost" size="sm">
                    <a
                      href={createWhatsappUrl({
                        ...booking,
                        eventType: fromApiEventType(booking.eventType),
                      })}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircleMore className="h-4 w-4" /> WhatsApp
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
            <p className="mt-2 text-sm text-gray-200">{fromApiEventType(booking.eventType)}</p>
            <p className="text-xs text-grayLuxury">
              {formatDate(booking.eventDate)} - {booking.city}
            </p>
            <div className="mt-3">
              <a
                href={createWhatsappUrl({
                  ...booking,
                  eventType: fromApiEventType(booking.eventType),
                })}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-goldLuxury"
              >
                <MessageCircleMore className="h-4 w-4" /> Contacter
              </a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

