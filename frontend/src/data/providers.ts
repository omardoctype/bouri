import type { Provider } from '../types';

export interface ProviderCatalogItem extends Provider {
  tags: string[];
}

export const PROVIDERS_CATALOG: ProviderCatalogItem[] = [
  {
    id: 'provider_photo_01',
    name: 'Atelier Noura Photo',
    category: 'Photographe',
    city: 'Tunis',
    description:
      'Studio specialise en mariages premium avec rendu editorial, portraits famille et direction artistique.',
    priceFrom: 1400,
    rating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 52 840 115',
    instagram: 'https://instagram.com/ateliernouraphoto',
    available: true,
    tags: ['mariage', 'editorial', 'portrait', 'album luxe'],
    createdAt: '2026-01-08T09:20:00.000Z',
  },
  {
    id: 'provider_photo_02',
    name: 'Carthage Lens House',
    category: 'Photographe',
    city: 'Sousse',
    description:
      'Equipe mobile pour evenements corporate et soirees privees avec livrables rapides pour reseaux sociaux.',
    priceFrom: 980,
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 21 554 033',
    instagram: 'https://instagram.com/carthagelenshouse',
    available: true,
    tags: ['corporate', 'soiree privee', 'contenu social', 'event recap'],
    createdAt: '2026-01-12T14:45:00.000Z',
  },
  {
    id: 'provider_photo_03',
    name: 'Studio Medina Sfax',
    category: 'Photographe',
    city: 'Sfax',
    description:
      'Photographie ceremonielle et couverture complete de journee avec equipe discrete et professionnelle.',
    priceFrom: 1150,
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 58 229 674',
    instagram: 'https://instagram.com/studiomedinasfax',
    available: true,
    tags: ['fiancailles', 'anniversaire', 'ceremonie', 'photo invite'],
    createdAt: '2026-01-23T11:00:00.000Z',
  },
  {
    id: 'provider_photo_04',
    name: 'Azur Wedding Frames',
    category: 'Photographe',
    city: 'Bizerte',
    description:
      'Photographes specialises en mariages bord de mer, lumieres naturelles et storytelling emotionnel.',
    priceFrom: 1600,
    rating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 97 118 205',
    instagram: 'https://instagram.com/azurweddingframes',
    available: false,
    tags: ['mariage', 'bord de mer', 'sunset shoot', 'storytelling'],
    createdAt: '2026-02-02T16:35:00.000Z',
  },
  {
    id: 'provider_dj_01',
    name: 'DJ Sami Pulse',
    category: 'DJ',
    city: 'Tunis',
    description:
      'DJ resident pour soirees premium, transitions propres et playlists hybrides orientales et internationales.',
    priceFrom: 850,
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 94 720 468',
    instagram: 'https://instagram.com/djsamipulse',
    available: true,
    tags: ['club style', 'mariage', 'open format', 'after party'],
    createdAt: '2026-02-05T10:10:00.000Z',
  },
  {
    id: 'provider_dj_02',
    name: 'DJ Ines Nova',
    category: 'DJ',
    city: 'Sousse',
    description:
      'Set feminin moderne pour anniversaires et soirees bac, avec gestion energique de la piste.',
    priceFrom: 780,
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 55 617 992',
    instagram: 'https://instagram.com/djinesnova',
    available: true,
    tags: ['soiree bac', 'anniversaire', 'house', 'commercial hits'],
    createdAt: '2026-02-12T15:20:00.000Z',
  },
  {
    id: 'provider_dj_03',
    name: 'DJ Rami Coastline',
    category: 'DJ',
    city: 'Djerba',
    description:
      'Ambiance lounge et beach events pour resorts, mariages destination et soirees privees.',
    priceFrom: 930,
    rating: 4.6,
    imageUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 28 470 621',
    instagram: 'https://instagram.com/djramicoastline',
    available: false,
    tags: ['beach event', 'resort', 'sunset set', 'destination wedding'],
    createdAt: '2026-02-19T18:00:00.000Z',
  },
  {
    id: 'provider_dj_04',
    name: 'DJ Yassine Loft',
    category: 'DJ',
    city: 'Nabeul',
    description:
      'DJ pour espaces indoor premium avec focus sur qualite sonore et transitions live clean.',
    priceFrom: 820,
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 23 665 010',
    instagram: 'https://instagram.com/djyassineloft',
    available: true,
    tags: ['indoor event', 'lounge', 'cocktail party', 'mixed audience'],
    createdAt: '2026-02-25T12:25:00.000Z',
  },
  {
    id: 'provider_band_01',
    name: 'Carthage Groove Band',
    category: 'Band',
    city: 'Tunis',
    description:
      'Band live pop, soul et oriental pour receptions haut de gamme et evenements institutionnels.',
    priceFrom: 2200,
    rating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 29 948 572',
    instagram: 'https://instagram.com/carthagegrooveband',
    available: true,
    tags: ['live music', 'corporate gala', 'mariage', 'oriental pop'],
    createdAt: '2026-03-02T09:45:00.000Z',
  },
  {
    id: 'provider_band_02',
    name: 'Mahdia Sunset Band',
    category: 'Band',
    city: 'Mahdia',
    description:
      'Formation live acoustique et festive pour fiancailles, anniversaires et soirees privees.',
    priceFrom: 1700,
    rating: 4.6,
    imageUrl:
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 92 511 248',
    instagram: 'https://instagram.com/mahdiasunsetband',
    available: true,
    tags: ['acoustic', 'fiancailles', 'chill set', 'cover songs'],
    createdAt: '2026-03-07T13:40:00.000Z',
  },
  {
    id: 'provider_band_03',
    name: 'Oasis Live Collective',
    category: 'Band',
    city: 'Gabes',
    description:
      'Collectif scene pour festivals et grandes soirees avec repertoire energique et participatif.',
    priceFrom: 2600,
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 54 300 987',
    instagram: 'https://instagram.com/oasislivecollective',
    available: true,
    tags: ['festival', 'scene live', 'crowd interaction', 'large audience'],
    createdAt: '2026-03-10T17:10:00.000Z',
  },
  {
    id: 'provider_deco_01',
    name: 'Jasmin Deco Atelier',
    category: 'Decorateur',
    city: 'Nabeul',
    description:
      'Decoration florale, arche ceremonie et design de table pour univers chic et harmonieux.',
    priceFrom: 1800,
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 24 804 663',
    instagram: 'https://instagram.com/jasmindecoatelier',
    available: true,
    tags: ['floral design', 'mariage', 'table setup', 'palette sur mesure'],
    createdAt: '2026-03-14T11:55:00.000Z',
  },
  {
    id: 'provider_deco_02',
    name: 'Gold Palm Design',
    category: 'Decorateur',
    city: 'Monastir',
    description:
      'Studio scenographie luxe avec structures LED, espaces photo et ambiance immersive.',
    priceFrom: 2400,
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 20 341 188',
    instagram: 'https://instagram.com/goldpalmdesign',
    available: false,
    tags: ['scenographie', 'corporate', 'photo zone', 'led decor'],
    createdAt: '2026-03-18T14:30:00.000Z',
  },
  {
    id: 'provider_video_01',
    name: 'Motion Kairouan Films',
    category: 'Videaste',
    city: 'Kairouan',
    description:
      'Equipe video pour films evenementiels emotionnels, drone et montage cinematic premium.',
    priceFrom: 1500,
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 96 609 417',
    instagram: 'https://instagram.com/motionkairouanfilms',
    available: true,
    tags: ['cinematic', 'drone', 'teaser', 'event film'],
    createdAt: '2026-03-23T10:05:00.000Z',
  },
  {
    id: 'provider_video_02',
    name: 'Blue Harbor Visuals',
    category: 'Videaste',
    city: 'Sfax',
    description:
      'Captation multicam et post-production rapide pour corporate, festivals et ceremonies privees.',
    priceFrom: 1350,
    rating: 4.6,
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 57 728 940',
    instagram: 'https://instagram.com/blueharborvisuals',
    available: true,
    tags: ['multicam', 'corporate', 'festival', 'fast delivery'],
    createdAt: '2026-03-29T15:15:00.000Z',
  },
  {
    id: 'provider_tech_01',
    name: 'Pulse Tech Son & Lumiere',
    category: 'Son & lumiere',
    city: 'Tunis',
    description:
      'Infrastructure technique complete pour grands evenements: line array, regie et programmation lumiere.',
    priceFrom: 2600,
    rating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 26 558 771',
    instagram: 'https://instagram.com/pulsetechsonlumiere',
    available: true,
    tags: ['line array', 'regie', 'concert', 'technical rider'],
    createdAt: '2026-04-03T09:35:00.000Z',
  },
  {
    id: 'provider_tech_02',
    name: 'Djerba Stage Lab',
    category: 'Son & lumiere',
    city: 'Djerba',
    description:
      'Prestataire technique specialise en scenes outdoor, festivals et experiences sonores immersives.',
    priceFrom: 2300,
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 53 904 226',
    instagram: 'https://instagram.com/djerbastagelab',
    available: true,
    tags: ['outdoor', 'festival', 'lighting design', 'stage build'],
    createdAt: '2026-04-08T13:55:00.000Z',
  },
  {
    id: 'provider_artist_01',
    name: 'Lina Ben Amor Live',
    category: 'Artiste',
    city: 'Sousse',
    description:
      'Artiste live pour openings, moments ceremoniels et performances vocales sur mesure.',
    priceFrom: 2100,
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80',
    phone: '+216 27 782 314',
    instagram: 'https://instagram.com/linabenamorlive',
    available: true,
    tags: ['live performance', 'opening act', 'ceremonie', 'vocal show'],
    createdAt: '2026-04-15T19:10:00.000Z',
  },
];

export const PROVIDER_OPTIONS = PROVIDERS_CATALOG.map((provider) => provider.name);
