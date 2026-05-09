import emailjs from '@emailjs/browser';

export type SendBookingEmailResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'missing_env' | 'send_failed';
      warning: string;
    };

export interface EmailBookingPayload {
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
  createdAt?: string;
  status?: string;
}

interface EmailJsConfig {
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
}

const logEmailWarning = (warning: string, error?: unknown) => {
  if (!import.meta.env.DEV) return;
  if (typeof error !== 'undefined') {
    console.warn(warning, error);
    return;
  }
  console.warn(warning);
};

const getEmailJsConfig = (): EmailJsConfig => {
  // Configure these values in your local `.env` file (never hardcode credentials in components).
  return {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim(),
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim(),
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim(),
  };
};

const hasEmailJsConfig = (config: EmailJsConfig) =>
  Boolean(config.serviceId && config.templateId && config.publicKey);

const getPreferredProvider = (booking: EmailBookingPayload) =>
  booking.preferredProviderName?.trim() ||
  booking.preferredProvider?.trim() ||
  'Non specifie';

const bookingToTemplateParams = (booking: EmailBookingPayload) => ({
  client_name: booking.fullName,
  client_email: booking.email,
  client_phone: booking.phone,
  city: booking.city,
  event_type: booking.eventType,
  event_date: booking.eventDate,
  location: booking.location,
  guests_count: booking.guestsCount,
  budget: booking.budget,
  services: booking.requestedServices.join(', '),
  preferred_provider: getPreferredProvider(booking),
  message: booking.message || '-',
  created_at: booking.createdAt || new Date().toISOString(),
  status: booking.status || 'NOUVELLE_DEMANDE',
});

export const sendBookingEmail = async (booking: EmailBookingPayload): Promise<SendBookingEmailResult> => {
  const config = getEmailJsConfig();

  if (!hasEmailJsConfig(config)) {
    const warning =
      '[Bouri Events] EmailJS non configure: ajoutez VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID et VITE_EMAILJS_PUBLIC_KEY dans votre fichier .env.';
    logEmailWarning(warning);
    return {
      ok: false,
      reason: 'missing_env',
      warning,
    };
  }

  try {
    await emailjs.send(config.serviceId!, config.templateId!, bookingToTemplateParams(booking), {
      publicKey: config.publicKey!,
    });
    return { ok: true };
  } catch (error) {
    const warning =
      "[Bouri Events] Echec d'envoi EmailJS: la reservation est bien sauvegardee.";
    logEmailWarning(warning, error);
    return {
      ok: false,
      reason: 'send_failed',
      warning,
    };
  }
};
