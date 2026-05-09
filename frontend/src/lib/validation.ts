import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalide.'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caracteres.'),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, 'Nom complet trop court.'),
  email: z.string().email('Email invalide.'),
  phone: z.string().min(8, 'Numero invalide.'),
  password: z.string().min(6, 'Minimum 6 caracteres.'),
  city: z.string().min(2, 'Ville requise.'),
});

export const bookingSchema = z.object({
  fullName: z.string().min(3, 'Nom requis.'),
  email: z.string().email('Email invalide.'),
  phone: z.string().min(8, 'Telephone requis.'),
  city: z.string().min(2, 'Ville requise.'),
  eventType: z.string().min(2, 'Type requis.'),
  eventDate: z.string().min(1, 'Date requise.'),
  location: z.string().min(3, 'Lieu requis.'),
  guestsCount: z.number().min(1, "Nombre d'invites requis."),
  budget: z.string().min(1, 'Budget requis.'),
  requestedServices: z.array(z.string()).min(1, 'Choisissez au moins un service.'),
  preferredProvider: z.string().min(1, 'Prestataire prefere requis.'),
  message: z.string().max(500, 'Maximum 500 caracteres.'),
});

export const profileSchema = z.object({
  fullName: z.string().min(3, 'Nom requis.'),
  phone: z.string().min(8, 'Telephone requis.'),
  city: z.string().min(2, 'Ville requise.'),
  avatarUrl: z.union([z.literal(''), z.string().url('URL avatar invalide.')]),
});

export const providerSchema = z.object({
  name: z.string().min(2, 'Nom requis.'),
  category: z.string().min(2, 'Categorie requise.'),
  city: z.string().min(2, 'Ville requise.'),
  description: z.string().min(12, 'Description trop courte.'),
  priceFrom: z.number().min(0, 'Prix invalide.'),
  rating: z.number().min(0).max(5),
  imageUrl: z.string().url('URL image invalide.'),
  phone: z.string().min(8, 'Telephone requis.'),
  instagram: z.string().url('Lien Instagram invalide.'),
  available: z.boolean(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, 'Nom de service requis.'),
  category: z.string().min(2, 'Categorie requise.'),
  description: z.string().min(8, 'Description trop courte.'),
  active: z.boolean(),
});

export const agencySettingsSchema = z.object({
  agencyName: z.string().min(2, "Nom d'agence requis."),
  agencyEmail: z.string().email('Email agence invalide.'),
  whatsappNumber: z.string().min(8, 'Numero WhatsApp invalide.'),
  instagramLink: z.union([z.literal(''), z.string().url('Lien Instagram invalide.')]),
  facebookLink: z.union([z.literal(''), z.string().url('Lien Facebook invalide.')]),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;
export type RegisterFormSchema = z.infer<typeof registerSchema>;
export type BookingFormSchema = z.infer<typeof bookingSchema>;
export type ProfileFormSchema = z.infer<typeof profileSchema>;
export type ProviderFormSchema = z.infer<typeof providerSchema>;
export type ServiceFormSchema = z.infer<typeof serviceSchema>;
export type AgencySettingsFormSchema = z.infer<typeof agencySettingsSchema>;
