import type { TFunction } from 'i18next';

const normalizeKey = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/['`\u2019]/g, '')
    .replace(/[-\u2013\u2014]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

const EVENT_TYPE_KEYS: Record<string, string> = {
  MARIAGE: 'MARIAGE',
  ANNIVERSAIRE: 'ANNIVERSAIRE',
  SOIREE_BAC: 'SOIREE_BAC',
  SOIREEBAC: 'SOIREE_BAC',
  FIANCAILLES: 'FIANCAILLES',
  CORPORATE: 'CORPORATE',
  FESTIVAL: 'FESTIVAL',
  SOIREE_PRIVEE: 'SOIREE_PRIVEE',
  SOIREEPRIVEE: 'SOIREE_PRIVEE',
  AUTRE: 'AUTRE'
};

const BOOKING_STATUS_KEYS: Record<string, string> = {
  NOUVELLE_DEMANDE: 'NOUVELLE_DEMANDE',
  NOUVELLEDEMANDE: 'NOUVELLE_DEMANDE',
  EN_COURS: 'EN_COURS',
  ENCOURS: 'EN_COURS',
  OFFRE_ENVOYEE: 'OFFRE_ENVOYEE',
  OFFREENVOYEE: 'OFFRE_ENVOYEE',
  CONFIRMEE: 'CONFIRMEE',
  ANNULEE: 'ANNULEE'
};

const SERVICE_KEYS: Record<string, string> = {
  PHOTOGRAPHE: 'PHOTOGRAPHE',
  VIDEASTE: 'VIDEASTE',
  DJ: 'DJ',
  BAND_MUSICAL: 'BAND_MUSICAL',
  BAND: 'BAND_MUSICAL',
  ARTISTE_LIVE: 'ARTISTE_LIVE',
  ARTISTE: 'ARTISTE_LIVE',
  DECORATION: 'DECORATION',
  DECORATEUR: 'DECORATION',
  SONORISATION: 'SONORISATION',
  SON_LUMIERE: 'SONORISATION',
  LUMIERE: 'LUMIERE',
  SALLE: 'SALLE',
  ANIMATION: 'ANIMATION',
  ORGANISATION_COMPLETE: 'ORGANISATION_COMPLETE'
};

const BUDGET_KEYS: Record<string, string> = {
  MOINS_DE_500_DT: 'MOINS_DE_500_DT',
  '500_DT_1000_DT': '500_DT_1000_DT',
  '1000_DT_2000_DT': '1000_DT_2000_DT',
  '2000_DT_5000_DT': '2000_DT_5000_DT',
  PLUS_DE_5000_DT: 'PLUS_DE_5000_DT',
  JE_NE_SAIS_PAS_ENCORE: 'JE_NE_SAIS_PAS_ENCORE',
  LESS_THAN_500_TND: 'MOINS_DE_500_DT',
  '500_TND_1000_TND': '500_DT_1000_DT',
  '1000_TND_2000_TND': '1000_DT_2000_DT',
  '2000_TND_5000_TND': '2000_DT_5000_DT',
  MORE_THAN_5000_TND: 'PLUS_DE_5000_DT',
  I_DONT_KNOW_YET: 'JE_NE_SAIS_PAS_ENCORE'
};

const PROVIDER_CATEGORY_KEYS: Record<string, string> = {
  PHOTOGRAPHE: 'PHOTOGRAPHE',
  DJ: 'DJ',
  BAND: 'BAND',
  BAND_MUSICAL: 'BAND',
  ARTISTE: 'ARTISTE',
  ARTISTE_LIVE: 'ARTISTE',
  DECORATION: 'DECORATION',
  DECORATEUR: 'DECORATION',
  VIDEASTE: 'VIDEASTE',
  SON_LUMIERE: 'SON_LUMIERE',
  SON_LUMIERE_: 'SON_LUMIERE',
  SONORISATION: 'SON_LUMIERE',
  SALLE: 'SALLE',
  ANIMATION: 'ANIMATION'
};

const SERVICE_CATEGORY_KEYS: Record<string, string> = {
  CAPTURE: 'CAPTURE',
  ANIMATION: 'ANIMATION',
  TECHNIQUE: 'TECHNIQUE',
  DECORATION: 'DECORATION',
  COORDINATION: 'COORDINATION',
  LIEU: 'LIEU'
};

const translateFromMap = (
  value: string,
  t: TFunction,
  scope:
    | 'eventTypes'
    | 'statuses'
    | 'services'
    | 'budgets'
    | 'providerCategories'
    | 'serviceCategories',
  keyMap: Record<string, string>
) => {
  const normalized = normalizeKey(value);
  const mapped = keyMap[normalized] ?? keyMap[value];

  if (!mapped) {
    return value;
  }

  return t(`entities.${scope}.${mapped}`, { defaultValue: value });
};

export const getEventTypeLabel = (eventType: string, t: TFunction) =>
  translateFromMap(eventType, t, 'eventTypes', EVENT_TYPE_KEYS);

export const getBookingStatusLabel = (status: string, t: TFunction) =>
  translateFromMap(status, t, 'statuses', BOOKING_STATUS_KEYS);

export const getServiceLabel = (service: string, t: TFunction) =>
  translateFromMap(service, t, 'services', SERVICE_KEYS);

export const getBudgetLabel = (budget: string, t: TFunction) =>
  translateFromMap(budget, t, 'budgets', BUDGET_KEYS);

export const getProviderCategoryLabel = (category: string, t: TFunction) =>
  translateFromMap(category, t, 'providerCategories', PROVIDER_CATEGORY_KEYS);

export const getServiceCategoryLabel = (category: string, t: TFunction) =>
  translateFromMap(category, t, 'serviceCategories', SERVICE_CATEGORY_KEYS);
