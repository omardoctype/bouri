export type ProviderCategory =
  | 'PHOTOGRAPHE'
  | 'DJ'
  | 'BAND'
  | 'ARTISTE'
  | 'DECORATION'
  | 'VIDEASTE'
  | 'SON_LUMIERE'
  | 'SALLE'
  | 'ANIMATION';

export interface ProviderRequest {
  name: string;
  category: ProviderCategory;
  city: string;
  description: string;
  priceFrom: number;
  rating: number;
  imageUrl?: string;
  phone: string;
  instagram?: string;
  available: boolean;
}

export interface ProviderResponse {
  id: number;
  name: string;
  category: ProviderCategory;
  city: string;
  description: string;
  priceFrom: number;
  rating: number;
  imageUrl?: string | null;
  phone: string;
  instagram?: string | null;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

