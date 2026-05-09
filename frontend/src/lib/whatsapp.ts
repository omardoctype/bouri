const sanitizeNumber = (value: string) => value.replace(/\s+/g, '').replace(/[^\d]/g, '');

const TUNISIA_COUNTRY_CODE = '216';
const DEFAULT_WHATSAPP_NUMBER = '21654016477';

const normalizeWhatsappNumber = (value?: string) => {
  const digits = sanitizeNumber(value ?? '');

  if (!digits) return DEFAULT_WHATSAPP_NUMBER;

  if (digits.startsWith(`${TUNISIA_COUNTRY_CODE}`)) return digits;

  if (digits.startsWith(`00${TUNISIA_COUNTRY_CODE}`)) {
    return digits.slice(2);
  }

  if (digits.startsWith('0')) {
    return `${TUNISIA_COUNTRY_CODE}${digits.slice(1)}`;
  }

  if (/^\d{8}$/.test(digits)) {
    return `${TUNISIA_COUNTRY_CODE}${digits}`;
  }

  return digits;
};

export interface WhatsappBookingPayload {
  id?: string | number;
  reference?: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestsCount: number;
  budget: string;
  requestedServices: string[];
  preferredProvider?: string | null;
  preferredProviderName?: string | null;
  message?: string | null;
}

const getPreferredProvider = (booking: WhatsappBookingPayload) =>
  booking.preferredProviderName?.trim() ||
  booking.preferredProvider?.trim() ||
  'Non specifie';

const getReference = (booking: WhatsappBookingPayload) =>
  booking.reference?.trim() ||
  String(booking.id ?? '-');

export const buildWhatsappBookingMessage = (booking: WhatsappBookingPayload) => {
  const lines = [
    'Bonjour equipe Bouri Events,',
    '',
    'Nouvelle demande de reservation:',
    `- Client: ${booking.fullName}`,
    `- Email: ${booking.email}`,
    `- Telephone: ${booking.phone}`,
    `- Ville: ${booking.city}`,
    `- Type d'evenement: ${booking.eventType}`,
    `- Date: ${booking.eventDate}`,
    `- Lieu: ${booking.location}`,
    `- Invites: ${booking.guestsCount}`,
    `- Budget: ${booking.budget}`,
    `- Services: ${booking.requestedServices.join(', ')}`,
    `- Prestataire prefere: ${getPreferredProvider(booking)}`,
    `- Message: ${booking.message || '-'}`,
    '',
    `Reference: ${getReference(booking)}`,
  ];

  return lines.join('\n');
};

export const createWhatsappUrl = (booking: WhatsappBookingPayload) => {
  const configured = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
  const number = normalizeWhatsappNumber(configured);
  const message = encodeURIComponent(buildWhatsappBookingMessage(booking));
  return `https://wa.me/${number}?text=${message}`;
};
