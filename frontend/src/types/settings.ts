export interface AppSettingsRequest {
  agencyName: string;
  agencyEmail: string;
  whatsappNumber: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export interface AppSettingsResponse {
  id: number;
  agencyName: string;
  agencyEmail: string;
  whatsappNumber: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
}

