import {
  addBooking,
  deleteBooking as deleteBookingInStorage,
  getBookings,
  getBookingsByClient as getBookingsByClientFromStorage,
  updateBookingStatus as updateBookingStatusInStorage,
} from '../lib/storage';
import { safeStorage } from '../lib/safe-storage';
import type { Booking, BookingFormValues, BookingStatus } from '../types';

export interface CreateBookingInput extends BookingFormValues {
  clientId: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseDraft = <T extends Record<string, unknown>>(value: string | null): T | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as unknown;
    return isRecord(parsed) ? (parsed as T) : null;
  } catch {
    return null;
  }
};

export const createBooking = (data: CreateBookingInput) => {
  const { clientId, ...bookingValues } = data;
  return addBooking(clientId, bookingValues);
};

export const getAllBookings = (): Booking[] => {
  return getBookings();
};

export const getBookingsByClient = (clientId: string): Booking[] => {
  return getBookingsByClientFromStorage(clientId);
};

export const updateBookingStatus = (id: string, status: BookingStatus) => {
  return updateBookingStatusInStorage(id, status);
};

export const deleteBooking = (id: string) => {
  return deleteBookingInStorage(id);
};

export const getBookingById = (id: string): Booking | null => {
  const bookings = getBookings();
  return bookings.find((booking) => booking.id === id) ?? null;
};

export const getBookingDraft = <T extends Record<string, unknown> = Record<string, unknown>>(
  draftKey: string,
): T | null => {
  return parseDraft<T>(safeStorage.getItem(draftKey));
};

export const saveBookingDraft = (draftKey: string, data: unknown) => {
  safeStorage.setItem(draftKey, JSON.stringify(data));
};

export const clearBookingDraft = (draftKey: string) => {
  safeStorage.removeItem(draftKey);
};
