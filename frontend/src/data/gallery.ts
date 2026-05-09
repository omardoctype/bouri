export interface GalleryItem {
  id: string;
  title: string;
  city: string;
  eventType: string;
  guests: number;
  imageUrl: string;
  description: string;
  servicesUsed: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gallery_01',
    title: 'Mariage Sunset a Gammarth',
    city: 'Tunis',
    eventType: 'Mariage',
    guests: 260,
    imageUrl:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    description: 'Ceremonie en fin de journee avec arche florale, band live et design de table dore.',
    servicesUsed: ['Decoration', 'Band musical', 'Photographe', 'Organisation complete'],
  },
  {
    id: 'gallery_02',
    title: 'Soiree Bac Campus Edition',
    city: 'Sousse',
    eventType: 'Soiree Bac',
    guests: 540,
    imageUrl:
      'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&w=1200&q=80',
    description: 'Grande soiree etudiante avec DJ set, LED wall et animation scenique.',
    servicesUsed: ['DJ', 'Lumiere', 'Sonorisation', 'Animation'],
  },
  {
    id: 'gallery_03',
    title: 'Lancement Produit Fintech',
    city: 'Sfax',
    eventType: 'Corporate',
    guests: 180,
    imageUrl:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    description: 'Evenement corporate avec reveal produit, captation multicam et espace media.',
    servicesUsed: ['Videaste', 'Sonorisation', 'Lumiere', 'Organisation complete'],
  },
  {
    id: 'gallery_04',
    title: 'Fiancailles Bord de Mer',
    city: 'Mahdia',
    eventType: 'Fiancailles',
    guests: 95,
    imageUrl:
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    description: 'Reception intimiste avec decor floral blanc, trio live et ambiance romantique.',
    servicesUsed: ['Decoration', 'Artiste live', 'Photographe'],
  },
  {
    id: 'gallery_05',
    title: 'Anniversaire Luxe Villa',
    city: 'Nabeul',
    eventType: 'Anniversaire',
    guests: 70,
    imageUrl:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    description: 'Soiree privee avec concept noir et or, DJ lounge et experience photo booth premium.',
    servicesUsed: ['DJ', 'Decoration', 'Photographe', 'Animation'],
  },
  {
    id: 'gallery_06',
    title: 'Soiree Privee Rooftop',
    city: 'Monastir',
    eventType: 'Soiree privee',
    guests: 140,
    imageUrl:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    description: 'Rooftop cocktail avec set live, lumiere architecturale et service VIP.',
    servicesUsed: ['Band musical', 'Lumiere', 'Organisation complete'],
  },
  {
    id: 'gallery_07',
    title: 'Festival Electro Coast',
    city: 'Djerba',
    eventType: 'Festival',
    guests: 1800,
    imageUrl:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    description: 'Production festival outdoor avec scene modulaire, regie son et laser show.',
    servicesUsed: ['Sonorisation', 'Lumiere', 'DJ', 'Organisation complete'],
  },
  {
    id: 'gallery_08',
    title: 'Reception Mariage Jardin',
    city: 'Bizerte',
    eventType: 'Mariage',
    guests: 210,
    imageUrl:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    description: 'Mise en scene botanique avec allee lumineuse, captation drone et set acoustique.',
    servicesUsed: ['Decoration', 'Videaste', 'Band musical', 'Photographe'],
  },
  {
    id: 'gallery_09',
    title: 'Convention Regionale RH',
    city: 'Gabes',
    eventType: 'Corporate',
    guests: 320,
    imageUrl:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    description: 'Convention entreprise avec plenieres, stands partenaires et gestion flux invites.',
    servicesUsed: ['Sonorisation', 'Lumiere', 'Salle', 'Organisation complete'],
  },
  {
    id: 'gallery_10',
    title: 'Nuit Artistique Medina',
    city: 'Kairouan',
    eventType: 'Autre',
    guests: 260,
    imageUrl:
      'https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?auto=format&fit=crop&w=1200&q=80',
    description: 'Programme culturel nocturne avec performance live et direction visuelle immersive.',
    servicesUsed: ['Artiste live', 'Lumiere', 'Photographe'],
  },
  {
    id: 'gallery_11',
    title: 'Afterwork Executive Club',
    city: 'Tunis',
    eventType: 'Soiree privee',
    guests: 120,
    imageUrl:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    description: 'Afterwork premium avec DJ select, animation soft et setup lounge.',
    servicesUsed: ['DJ', 'Animation', 'Decoration'],
  },
  {
    id: 'gallery_12',
    title: 'Mariage Destination Beach',
    city: 'Djerba',
    eventType: 'Mariage',
    guests: 175,
    imageUrl:
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
    description: 'Celebration en bord de mer avec experience complete de bienvenue, ceremonie et after party.',
    servicesUsed: ['Organisation complete', 'Photographe', 'Videaste', 'Sonorisation'],
  },
];
