import type { BookingStatus, EventType } from '../types/booking';

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  MARIAGE: 'Mariage',
  ANNIVERSAIRE: 'Anniversaire',
  SOIREE_BAC: 'Soiree Bac',
  FIANCAILLES: 'Fiancailles',
  CORPORATE: 'Corporate',
  FESTIVAL: 'Festival',
  SOIREE_PRIVEE: 'Soiree privee',
  AUTRE: 'Autre',
};

const EVENT_TYPE_TO_API: Record<string, EventType> = {
  MARIAGE: 'MARIAGE',
  MARIAGE_EVENT: 'MARIAGE',
  MARIAGE_LABEL: 'MARIAGE',
  MARIAGE_TEXT: 'MARIAGE',
  MARIAGE_CARD: 'MARIAGE',
  MARIAGE_VALUE: 'MARIAGE',
  MARIAGE_CHOICE: 'MARIAGE',
  MARIAGE_OPTION: 'MARIAGE',
  MARIAGE_SELECT: 'MARIAGE',
  MARIAGE_ITEM: 'MARIAGE',
  MARIAGE_TYPE: 'MARIAGE',
  ANNIVERSAIRE: 'ANNIVERSAIRE',
  SOIREE_BAC: 'SOIREE_BAC',
  SOIREE_BAC_EVENT: 'SOIREE_BAC',
  FIANCAILLES: 'FIANCAILLES',
  CORPORATE: 'CORPORATE',
  FESTIVAL: 'FESTIVAL',
  AUTRE: 'AUTRE',
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  NOUVELLE_DEMANDE: 'Nouvelle demande',
  EN_COURS: 'En cours',
  OFFRE_ENVOYEE: 'Offre envoyee',
  CONFIRMEE: 'Confirmee',
  ANNULEE: 'Annulee',
};

const STATUS_TO_API: Record<string, BookingStatus> = {
  NOUVELLE_DEMANDE: 'NOUVELLE_DEMANDE',
  NOUVELLEDEMANDE: 'NOUVELLE_DEMANDE',
  EN_COURS: 'EN_COURS',
  ENCOURS: 'EN_COURS',
  OFFRE_ENVOYEE: 'OFFRE_ENVOYEE',
  OFFREENVOYEE: 'OFFRE_ENVOYEE',
  CONFIRMEE: 'CONFIRMEE',
  ANNULEE: 'ANNULEE',
};

const normalizeEventTypeKey = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

export const toApiEventType = (value: string): EventType => {
  const key = normalizeEventTypeKey(value);

  if (key.includes('SOIREE') && key.includes('BAC')) return 'SOIREE_BAC';
  if (key.includes('SOIREE') && key.includes('PRIVEE')) return 'SOIREE_PRIVEE';
  if (key.includes('FIANCAILLES')) return 'FIANCAILLES';
  if (key.includes('ANNIVERSAIRE')) return 'ANNIVERSAIRE';
  if (key.includes('MARIAGE')) return 'MARIAGE';
  if (key.includes('CORPORATE') || key.includes('ENTREPRISE')) return 'CORPORATE';
  if (key.includes('FESTIVAL') || key.includes('CLUB')) return 'FESTIVAL';
  if (key in EVENT_TYPE_TO_API) return EVENT_TYPE_TO_API[key];
  return 'AUTRE';
};

export const fromApiEventType = (value: EventType | string): string => {
  if (value in EVENT_TYPE_LABELS) {
    return EVENT_TYPE_LABELS[value as EventType];
  }
  return value;
};

export const fromApiBookingStatus = (value: BookingStatus | string): string => {
  if (value in STATUS_LABELS) {
    return STATUS_LABELS[value as BookingStatus];
  }
  return value;
};

export const toApiBookingStatus = (value: string): BookingStatus => {
  const key = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  if (key in STATUS_TO_API) {
    return STATUS_TO_API[key];
  }

  return 'NOUVELLE_DEMANDE';
};

export const BOOKING_STATUS_OPTIONS: Array<{ value: BookingStatus; label: string }> = [
  { value: 'NOUVELLE_DEMANDE', label: 'Nouvelle demande' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'OFFRE_ENVOYEE', label: 'Offre envoyee' },
  { value: 'CONFIRMEE', label: 'Confirmee' },
  { value: 'ANNULEE', label: 'Annulee' },
];

export const EVENT_TYPE_OPTIONS: Array<{ value: EventType; label: string }> = [
  { value: 'MARIAGE', label: 'Mariage' },
  { value: 'ANNIVERSAIRE', label: 'Anniversaire' },
  { value: 'SOIREE_BAC', label: 'Soiree Bac' },
  { value: 'FIANCAILLES', label: 'Fiancailles' },
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'SOIREE_PRIVEE', label: 'Soiree privee' },
  { value: 'AUTRE', label: 'Autre' },
];
