import type { UserResponse } from './auth';
import type { BookingResponse } from './booking';

export interface DashboardStatsResponse {
  totalBookings: number;
  newBookings: number;
  inProgressBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalClients: number;
  totalProviders: number;
  mostRequestedEventType: string;
  bookingsByStatus: Record<string, number>;
  bookingsByEventType: Record<string, number>;
  latestBookings: BookingResponse[];
}

export interface UpdateClientActiveRequest {
  active: boolean;
}

export type AdminClientResponse = UserResponse;

