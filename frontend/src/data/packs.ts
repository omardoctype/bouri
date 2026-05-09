export interface PackItem {
  id: string;
  name: string;
  price: string;
  description: string;
  items: string[];
  bestFor: string;
  supportLevel: string;
}

export const PACKS_CATALOG: PackItem[] = [
  {
    id: 'pack_basic',
    name: 'Pack Basic',
    price: 'A partir de 890 DT',
    description: 'Solution simple et efficace pour petits evenements et celebrations familiales.',
    items: ['DJ ou animateur', 'Couverture photo 2h', 'Coordination express sur place'],
    bestFor: 'Anniversaire, petite soiree privee',
    supportLevel: 'Support standard',
  },
  {
    id: 'pack_standard',
    name: 'Pack Standard',
    price: 'A partir de 1 790 DT',
    description: 'Package equilibre avec animation, captation et mise en scene elegante.',
    items: ['DJ set complet', 'Photographe 4h', 'Decoration ambiance', 'Hotline planning'],
    bestFor: 'Fiancailles, anniversaire premium',
    supportLevel: 'Support prioritaire',
  },
  {
    id: 'pack_premium',
    name: 'Pack Premium',
    price: 'A partir de 3 250 DT',
    description: 'Experience haut de gamme avec equipe dediee et execution detaillee.',
    items: ['Photo + video', 'Decoration scenographie', 'Son & lumiere', 'Chef de projet dedie'],
    bestFor: 'Soiree Bac, corporate, soiree privee',
    supportLevel: 'Support VIP',
  },
  {
    id: 'pack_mariage_royal',
    name: 'Pack Mariage Royal',
    price: 'A partir de 5 990 DT',
    description: 'Offre signature pour mariages d exception avec orchestration complete.',
    items: [
      'Direction artistique mariage',
      'Photo + video full day',
      'Band live ou artiste',
      'Son, lumiere et coordination jour J',
    ],
    bestFor: 'Mariage haut standing',
    supportLevel: 'Support ultra VIP',
  },
  {
    id: 'pack_sur_mesure',
    name: 'Pack Sur Mesure',
    price: 'Tarif apres brief',
    description: 'Configuration personnalisee selon objectifs, ville, nombre d invites et style.',
    items: ['Audit des besoins', 'Selection flexible des services', 'Planning adapte', 'Budget optimise'],
    bestFor: 'Corporate, festival, format hybride',
    supportLevel: 'Support dedie sur devis',
  },
];

export const PACKS = PACKS_CATALOG;
