import type { Provider } from '../types';
import { EVENT_TYPES_CATALOG } from './eventTypes';
import { PACKS_CATALOG } from './packs';
import { PROVIDERS_CATALOG } from './providers';

export const DEMO_PROVIDERS: Provider[] = PROVIDERS_CATALOG.map((provider) => {
  const { tags, ...providerData } = provider;
  void tags;
  return providerData;
});

export const HOME_FEATURES = [
  {
    title: 'Planification intelligente',
    description: 'Brief digital, matching rapide et suivi clair depuis votre espace client.',
  },
  {
    title: 'Prestataires verifies',
    description: 'Reseau tunisien qualifie avec notes clients et disponibilite mise a jour.',
  },
  {
    title: 'Execution haut de gamme',
    description: 'Un standard premium pour mariages, corporate, festivals et soirees privees.',
  },
];

export const PACKS = PACKS_CATALOG;

export const PUBLIC_EVENTS = EVENT_TYPES_CATALOG.filter((eventType) => eventType.id !== 'autre').map(
  (eventType) => ({
    title: eventType.name,
    description: eventType.shortDescription,
  }),
);
