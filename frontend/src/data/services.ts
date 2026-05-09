export interface ServiceCatalogItem {
  id: string;
  name: string;
  category: 'Capture' | 'Animation' | 'Technique' | 'Decoration' | 'Lieu' | 'Coordination';
  description: string;
  priceHint: string;
  deliverables: string[];
}

export const SERVICES_CATALOG: ServiceCatalogItem[] = [
  {
    id: 'service_photographe',
    name: 'Photographe',
    category: 'Capture',
    description: 'Reportage photo editorial, portraits invites et albums premium.',
    priceHint: 'A partir de 900 DT',
    deliverables: ['Shooting evenement', 'Retouche pro', 'Galerie HD'],
  },
  {
    id: 'service_videaste',
    name: 'Videaste',
    category: 'Capture',
    description: 'Captation video multicam, teaser reel et film recap emotionnel.',
    priceHint: 'A partir de 1 200 DT',
    deliverables: ['Film highlight', 'Version verticale social media', 'Livraison 4K'],
  },
  {
    id: 'service_dj',
    name: 'DJ',
    category: 'Animation',
    description: 'Programmation musicale sur mesure et gestion energie de piste.',
    priceHint: 'A partir de 700 DT',
    deliverables: ['Set personnalise', 'Coordination timing', 'Materiel de base'],
  },
  {
    id: 'service_band',
    name: 'Band musical',
    category: 'Animation',
    description: 'Groupes live orientaux, pop ou fusion pour experience premium.',
    priceHint: 'A partir de 1 500 DT',
    deliverables: ['Performance live', 'Repertoire adapte', 'Balance son'],
  },
  {
    id: 'service_artiste',
    name: 'Artiste live',
    category: 'Animation',
    description: 'Interventions sceniques exclusives pour moments forts.',
    priceHint: 'A partir de 2 000 DT',
    deliverables: ['Performance signature', 'Brief artistique', 'Presence backstage'],
  },
  {
    id: 'service_decoration',
    name: 'Decoration',
    category: 'Decoration',
    description: 'Concept visuel global, fleuristerie et mise en scene harmonieuse.',
    priceHint: 'A partir de 1 400 DT',
    deliverables: ['Moodboard', 'Installation', 'Demontage'],
  },
  {
    id: 'service_sonorisation',
    name: 'Sonorisation',
    category: 'Technique',
    description: 'Systemes audio calibres pour ceremonies, concerts et conferences.',
    priceHint: 'A partir de 1 100 DT',
    deliverables: ['Reglage audio', 'Technicien sur site', 'Backline de base'],
  },
  {
    id: 'service_lumiere',
    name: 'Lumiere',
    category: 'Technique',
    description: 'Eclairage scenique, architectural et ambiance immersive.',
    priceHint: 'A partir de 900 DT',
    deliverables: ['Plan lumiere', 'Programmation live', 'Effets LED'],
  },
  {
    id: 'service_salle',
    name: 'Salle',
    category: 'Lieu',
    description: 'Selection d espaces partenaires selon capacite, standing et localisation.',
    priceHint: 'A partir de 1 000 DT',
    deliverables: ['Shortlist lieux', 'Visite accompagnee', 'Support negociation'],
  },
  {
    id: 'service_animation',
    name: 'Animation',
    category: 'Animation',
    description: 'MC, jeux, activations invites et experiences participatives.',
    priceHint: 'A partir de 600 DT',
    deliverables: ['Script animation', 'Timing scene', 'Coordination DJ'],
  },
  {
    id: 'service_organisation_complete',
    name: 'Organisation complete',
    category: 'Coordination',
    description: 'Pilotage integral du projet depuis le brief jusqu au jour J.',
    priceHint: 'A partir de 2 500 DT',
    deliverables: ['Chef de projet dedie', 'Roadmap complete', 'Suivi fournisseurs'],
  },
];

export const SERVICE_OPTIONS = SERVICES_CATALOG.map((item) => item.name);
