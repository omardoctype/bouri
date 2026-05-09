export type EventType =
  | 'MARIAGE'
  | 'ANNIVERSAIRE'
  | 'SOIREE_BAC'
  | 'FIANCAILLES'
  | 'CORPORATE'
  | 'FESTIVAL'
  | 'SOIREE_PRIVEE'
  | 'AUTRE';

export type BookingStatus =
  | 'NOUVELLE_DEMANDE'
  | 'EN_COURS'
  | 'OFFRE_ENVOYEE'
  | 'CONFIRMEE'
  | 'ANNULEE';

export interface BookingRequest {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  eventType: EventType;
  eventDate: string;
  location: string;
  guestsCount: number;
  budget: string;
  requestedServices: string[];
  preferredProviderId?: number | null;
  preferredProviderName?: string | null;
  message?: string;
}

export interface BookingResponse {
  id: number;
  reference: string;
  clientId: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  eventType: EventType;
  eventDate: string;
  location: string;
  guestsCount: number;
  budget: string;
  requestedServices: string[];
  preferredProviderId?: number | null;
  preferredProviderName?: string | null;
  message?: string;
  status: BookingStatus;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

export interface UpdateBookingNoteRequest {
  adminNote: string;
}

export interface AdminBookingFilters {
  status?: BookingStatus;
  eventType?: EventType;
  search?: string;
}

