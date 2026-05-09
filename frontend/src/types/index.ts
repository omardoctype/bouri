export type UserRole = 'client' | 'admin';

export type BookingStatus =
  | 'Nouvelle demande'
  | 'En cours'
  | 'Offre envoyee'
  | 'Confirmee'
  | 'Annulee';

export type EventType =
  | 'Mariage'
  | 'Anniversaire'
  | 'Soiree Bac'
  | 'Fiancailles'
  | 'Corporate'
  | 'Festival'
  | 'Soiree privee'
  | 'Autre';

export interface ClientUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  city?: string;
  avatarUrl?: string;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  priceFrom: number;
  rating: number;
  imageUrl: string;
  phone: string;
  instagram: string;
  available: boolean;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  active: boolean;
  createdAt: string;
}

export interface AgencySettings {
  agencyName: string;
  agencyEmail: string;
  whatsappNumber: string;
  instagramLink: string;
  facebookLink: string;
}

export interface Booking {
  id: string;
  clientId: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestsCount: number;
  budget: string;
  requestedServices: string[];
  preferredProvider: string;
  message: string;
  status: BookingStatus;
  estimatedBudgetValue: number;
  createdAt: string;
}

export interface DashboardStat {
  label: string;
  value: number | string;
  trend?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
}

export interface BookingFormValues {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestsCount: number;
  budget: string;
  requestedServices: string[];
  preferredProvider: string;
  message: string;
}
