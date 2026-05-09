import type { AgencySettings, BookingStatus, EventType } from '../types';
import { EVENT_TYPE_OPTIONS } from './eventTypes';
import { SERVICE_OPTIONS } from './services';

export const APP_NAME = 'Bouri Events';

export const COLORS = {
  black: '#07070A',
  card: '#111118',
  gold: '#D4AF37',
  purple: '#7C3AED',
  pink: '#EC4899',
  offWhite: '#F8F7F3',
  gray: '#A1A1AA',
};

export const EVENT_TYPES: EventType[] = EVENT_TYPE_OPTIONS as EventType[];

export const SERVICES = SERVICE_OPTIONS;

export const SERVICE_CATEGORIES = [
  'Capture',
  'Animation',
  'Technique',
  'Decoration',
  'Coordination',
  'Lieu',
];

export const BUDGET_OPTIONS = [
  'Moins de 500 DT',
  '500 DT - 1000 DT',
  '1000 DT - 2000 DT',
  '2000 DT - 5000 DT',
  'Plus de 5000 DT',
  'Je ne sais pas encore',
];

export const BOOKING_STATUSES: BookingStatus[] = [
  'Nouvelle demande',
  'En cours',
  'Offre envoyee',
  'Confirmee',
  'Annulee',
] as BookingStatus[];

export const PROVIDER_CATEGORIES = [
  'Photographe',
  'DJ',
  'Band',
  'Artiste',
  'Decorateur',
  'Videaste',
  'Son & lumiere',
];

export const CITIES = [
  'Tunis',
  'Sfax',
  'Sousse',
  'Monastir',
  'Nabeul',
  'Mahdia',
  'Djerba',
  'Bizerte',
  'Gabes',
  'Kairouan',
];

export const ADMIN_CREDENTIALS = {
  email: 'admin@bourievents.tn',
  password: 'Admin123!',
};

export const DEFAULT_AGENCY_SETTINGS: AgencySettings = {
  agencyName: 'Bouri Events',
  agencyEmail: 'contact@bourievents.tn',
  whatsappNumber: '21671000000',
  instagramLink: 'https://instagram.com/bourievents',
  facebookLink: 'https://facebook.com/bourievents',
};

export const BUDGET_TO_VALUE: Record<string, number> = {
  'Moins de 500 DT': 400,
  '500 DT - 1000 DT': 750,
  '1000 DT - 2000 DT': 1500,
  '2000 DT - 5000 DT': 3500,
  'Plus de 5000 DT': 6500,
  'Je ne sais pas encore': 0,
};
