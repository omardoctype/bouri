import type { Booking } from '../types';

export const groupByStatus = (bookings: Booking[]) => {
  const map = new Map<string, number>();
  bookings.forEach((booking) => {
    map.set(booking.status, (map.get(booking.status) ?? 0) + 1);
  });
  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
};

export const groupByEventType = (bookings: Booking[]) => {
  const map = new Map<string, number>();
  bookings.forEach((booking) => {
    map.set(booking.eventType, (map.get(booking.eventType) ?? 0) + 1);
  });
  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
};

export const estimateTotalBudget = (bookings: Booking[]) =>
  bookings.reduce((sum, booking) => sum + booking.estimatedBudgetValue, 0);

export const monthlyBookings = (bookings: Booking[]) => {
  const formatter = new Intl.DateTimeFormat('fr-TN', { month: 'short' });
  const map = new Map<string, number>();

  bookings.forEach((booking) => {
    const month = formatter.format(new Date(booking.createdAt));
    map.set(month, (map.get(month) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
};

