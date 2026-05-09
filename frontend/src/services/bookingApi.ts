import { api } from '../lib/api';
import type {
  AdminBookingFilters,
  BookingRequest,
  BookingResponse,
  BookingStatus,
} from '../types/booking';

export const createBooking = async (data: BookingRequest): Promise<BookingResponse> => {
  const response = await api.post<BookingResponse>('/client/bookings', data);
  return response.data;
};

export const getMyBookings = async (): Promise<BookingResponse[]> => {
  const response = await api.get<BookingResponse[]>('/client/bookings');
  return response.data;
};

export const getMyBooking = async (id: number): Promise<BookingResponse> => {
  const response = await api.get<BookingResponse>(`/client/bookings/${id}`);
  return response.data;
};

export const getAllBookings = async (filters?: AdminBookingFilters): Promise<BookingResponse[]> => {
  const params: Record<string, string> = {};

  if (filters?.status) params.status = filters.status;
  if (filters?.eventType) params.eventType = filters.eventType;
  if (filters?.search?.trim()) params.search = filters.search.trim();

  const response = await api.get<BookingResponse[]>('/admin/bookings', { params });
  return response.data;
};

export const getBooking = async (id: number): Promise<BookingResponse> => {
  const response = await api.get<BookingResponse>(`/admin/bookings/${id}`);
  return response.data;
};

export const updateBookingStatus = async (id: number, status: BookingStatus): Promise<BookingResponse> => {
  const response = await api.patch<BookingResponse>(`/admin/bookings/${id}/status`, { status });
  return response.data;
};

export const updateBookingNote = async (id: number, note: string): Promise<BookingResponse> => {
  const response = await api.put<BookingResponse>(`/admin/bookings/${id}/note`, { adminNote: note });
  return response.data;
};

export const deleteBooking = async (id: number): Promise<void> => {
  await api.delete(`/admin/bookings/${id}`);
};

