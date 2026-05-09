export interface TestimonialItem {
  id: string;
  clientName: string;
  city: string;
  eventType: string;
  rating: number;
  quote: string;
  eventDate: string;
  avatarUrl: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testimonial_01',
    clientName: 'Amira Ben Salem',
    city: 'Tunis',
    eventType: 'Mariage',
    rating: 5,
    quote:
      'Nous avons eu une organisation tres fluide du debut a la fin. L equipe a respecte le style que je voulais et chaque detail etait bien pense.',
    eventDate: '2026-03-14',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'testimonial_02',
    clientName: 'Youssef Trabelsi',
    city: 'Sousse',
    eventType: 'Corporate',
    rating: 5,
    quote:
      'Pour notre lancement produit, Bouri Events a gere la technique, la scene et les prestataires avec un vrai niveau professionnel.',
    eventDate: '2026-04-22',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'testimonial_03',
    clientName: 'Maha Khelifi',
    city: 'Sfax',
    eventType: 'Fiancailles',
    rating: 4.9,
    quote:
      'Le rendu decor et la musique live etaient magnifiques. Meme nos invites ont demande les contacts apres la soiree.',
    eventDate: '2026-02-10',
    avatarUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'testimonial_04',
    clientName: 'Nader Gharbi',
    city: 'Nabeul',
    eventType: 'Anniversaire',
    rating: 4.8,
    quote:
      'Service rapide, equipe a l ecoute et tres bonne ambiance. Le DJ a parfaitement compris le profil de nos invites.',
    eventDate: '2026-01-29',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'testimonial_05',
    clientName: 'Rim Jebali',
    city: 'Monastir',
    eventType: 'Soiree privee',
    rating: 5,
    quote:
      'On cherchait une soiree elegante sans stress. Tout a ete gere avec precision, du timing jusqu a la lumiere.',
    eventDate: '2026-03-01',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'testimonial_06',
    clientName: 'Sami Ben Othman',
    city: 'Mahdia',
    eventType: 'Soiree Bac',
    rating: 4.9,
    quote:
      'Production tres propre pour une grosse soiree. Son, lumiere et securite etaient bien coordonnes avec reactivite.',
    eventDate: '2025-06-20',
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'testimonial_07',
    clientName: 'Oumaima Charfi',
    city: 'Djerba',
    eventType: 'Mariage',
    rating: 5,
    quote:
      'Le pack mariage royal est vraiment complet. Nous avons recu des propositions claires et une presence rassurante le jour J.',
    eventDate: '2026-04-05',
    avatarUrl:
      'https://images.unsplash.com/photo-1542204625-de293a18df74?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'testimonial_08',
    clientName: 'Walid Hamrouni',
    city: 'Bizerte',
    eventType: 'Festival',
    rating: 4.8,
    quote:
      'Pour un format festival, la gestion logistique et la coordination des intervenants ont ete tres solides.',
    eventDate: '2025-09-12',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
];
