export interface EventTypeItem {
  id: string;
  name: string;
  shortDescription: string;
  typicalGuests: string;
  highlight: string;
}

export const EVENT_TYPES_CATALOG: EventTypeItem[] = [
  {
    id: 'mariage',
    name: 'Mariage',
    shortDescription: 'Ceremonies elegantes, receptions haut de gamme et coordination complete.',
    typicalGuests: '120 - 450 invites',
    highlight: 'Direction artistique + suivi minute par minute',
  },
  {
    id: 'anniversaire',
    name: 'Anniversaire',
    shortDescription: 'Fetes privees personnalisees, themes creatifs et ambiance festive.',
    typicalGuests: '30 - 180 invites',
    highlight: 'Animation et scenographie adaptees au style du client',
  },
  {
    id: 'soiree-bac',
    name: 'Soiree Bac',
    shortDescription: 'Production jeune et dynamique avec DJ sets, lumiere et show interactif.',
    typicalGuests: '80 - 500 invites',
    highlight: 'Scenarios scene + son/lumiere immersif',
  },
  {
    id: 'fiancailles',
    name: 'Fiancailles',
    shortDescription: 'Evenements intimistes chic avec decoration florale et musique live.',
    typicalGuests: '40 - 220 invites',
    highlight: 'Ambiance romantique et accueil premium',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    shortDescription: 'Lancements, galas et rencontres professionnelles avec execution rigoureuse.',
    typicalGuests: '50 - 800 invites',
    highlight: 'Pilotage projet + experience marque',
  },
  {
    id: 'festival',
    name: 'Festival',
    shortDescription: 'Formats grand public avec logistique scene, artistes et securite technique.',
    typicalGuests: '500 - 5 000 participants',
    highlight: 'Regie globale et gestion flux',
  },
  {
    id: 'soiree-privee',
    name: 'Soiree privee',
    shortDescription: 'Experiences exclusives en villa, rooftop ou lounge avec service discret.',
    typicalGuests: '20 - 250 invites',
    highlight: 'Concept sur mesure et execution confidentielle',
  },
  {
    id: 'autre',
    name: 'Autre',
    shortDescription: 'Projet special ou format hybride avec accompagnement personnalise.',
    typicalGuests: 'Selon besoin',
    highlight: 'Brief libre et recommandation dediee',
  },
];

export const EVENT_TYPE_OPTIONS = EVENT_TYPES_CATALOG.map((item) => item.name);
