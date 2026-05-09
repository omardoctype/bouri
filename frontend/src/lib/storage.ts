import {
  ADMIN_CREDENTIALS,
  BUDGET_TO_VALUE,
  DEFAULT_AGENCY_SETTINGS,
  SERVICE_CATEGORIES,
  SERVICES,
} from '../data/constants';
import { DEMO_PROVIDERS } from '../data/demo';
import type {
  AgencySettings,
  Booking,
  BookingFormValues,
  BookingStatus,
  ClientUser,
  LoginPayload,
  Provider,
  RegisterPayload,
  ServiceItem,
} from '../types';
import { createId } from './utils';
import { safeStorage } from './safe-storage';

const STORAGE_KEYS = {
  users: 'bouri_users',
  clients: 'bouri_users',
  bookings: 'bouri_bookings',
  providers: 'bouri_providers',
  services: 'bouri_services',
  agencySettings: 'bouri_agency_settings',
  currentUser: 'bouri_current_user',
  currentClientId: 'bouri_current_user',
  adminSession: 'bouri_admin_session',
} as const;

const LEGACY_STORAGE_KEYS = {
  clients: 'bouri_clients',
  currentClientId: 'bouri_current_client_id',
} as const;

const nowISO = () => new Date().toISOString();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseJSON = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const parseJSONArray = <T>(value: string | null, fallback: T[]): T[] => {
  const parsed = parseJSON<unknown>(value, fallback);
  return Array.isArray(parsed) ? (parsed as T[]) : fallback;
};

const parseJSONObject = <T extends object>(value: string | null, fallback: T): T => {
  const parsed = parseJSON<unknown>(value, fallback);
  if (!isRecord(parsed)) return fallback;
  return { ...fallback, ...(parsed as object) } as T;
};

const parseNullableObject = <T extends object>(value: string | null): T | null => {
  const parsed = parseJSON<unknown>(value, null);
  return isRecord(parsed) ? (parsed as T) : null;
};

const setJSON = (key: string, value: unknown) => {
  safeStorage.setItem(key, JSON.stringify(value));
};

const serviceCategoryByName = (serviceName: string) => {
  const lower = serviceName.toLowerCase();

  if (lower.includes('photo') || lower.includes('video') || lower.includes('videaste')) {
    return 'Capture';
  }
  if (lower.includes('dj') || lower.includes('band') || lower.includes('artiste') || lower.includes('animation')) {
    return 'Animation';
  }
  if (lower.includes('son') || lower.includes('lumiere')) {
    return 'Technique';
  }
  if (lower.includes('deco')) {
    return 'Decoration';
  }
  if (lower.includes('organisation')) {
    return 'Coordination';
  }
  if (lower.includes('salle')) {
    return 'Lieu';
  }

  return SERVICE_CATEGORIES[0];
};

const defaultServiceItems: ServiceItem[] = SERVICES.map((serviceName, index) => ({
  id: `service_${index + 1}`,
  name: serviceName,
  category: serviceCategoryByName(serviceName),
  description: `Service ${serviceName} pour evenements premium en Tunisie.`,
  active: true,
  createdAt: '2026-01-01T00:00:00.000Z',
}));

const demoClients: ClientUser[] = [
  {
    id: 'client_demo_1',
    fullName: 'Amira Ben Salem',
    email: 'amira.bensalem@mail.tn',
    phone: '+216 28 765 210',
    password: 'Client123!',
    createdAt: '2026-03-01T08:40:00.000Z',
    city: 'Tunis',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'client_demo_2',
    fullName: 'Youssef Trabelsi',
    email: 'youssef.trabelsi@mail.tn',
    phone: '+216 55 300 414',
    password: 'Client123!',
    createdAt: '2026-03-04T11:10:00.000Z',
    city: 'Sousse',
    avatarUrl: '',
  },
];

const demoBookings: Booking[] = [
  {
    id: 'booking_demo_1',
    clientId: 'client_demo_1',
    fullName: 'Amira Ben Salem',
    email: 'amira.bensalem@mail.tn',
    phone: '+216 28 765 210',
    city: 'Tunis',
    eventType: 'Mariage',
    eventDate: '2026-07-10',
    location: 'La Marsa',
    guestsCount: 220,
    budget: '2000 DT - 5000 DT',
    requestedServices: ['Photographe', 'Videaste', 'Decoration', 'Organisation complete'],
    preferredProvider: 'Lumiere Royale Studio',
    message: 'Nous voulons un style chic et moderne avec entree artistique.',
    status: 'En cours',
    estimatedBudgetValue: 3500,
    createdAt: '2026-04-19T13:10:00.000Z',
  },
  {
    id: 'booking_demo_2',
    clientId: 'client_demo_2',
    fullName: 'Youssef Trabelsi',
    email: 'youssef.trabelsi@mail.tn',
    phone: '+216 55 300 414',
    city: 'Sousse',
    eventType: 'Corporate',
    eventDate: '2026-06-22',
    location: 'Kantaoui',
    guestsCount: 140,
    budget: 'Plus de 5000 DT',
    requestedServices: ['Sonorisation', 'Lumiere', 'DJ', 'Animation'],
    preferredProvider: 'Pulse Son & Lumiere',
    message: 'Lancement produit avec reveal scene et zone media.',
    status: 'Offre envoyee',
    estimatedBudgetValue: 6500,
    createdAt: '2026-04-30T09:00:00.000Z',
  },
  {
    id: 'booking_demo_3',
    clientId: 'client_demo_1',
    fullName: 'Amira Ben Salem',
    email: 'amira.bensalem@mail.tn',
    phone: '+216 28 765 210',
    city: 'Nabeul',
    eventType: 'Fiancailles',
    eventDate: '2026-05-29',
    location: 'Yasmine Hammamet',
    guestsCount: 85,
    budget: '1000 DT - 2000 DT',
    requestedServices: ['Band musical', 'Decoration'],
    preferredProvider: 'Nour Deco Lab',
    message: 'Ambiance intime, palette beige et dorure.',
    status: 'Confirmee',
    estimatedBudgetValue: 1500,
    createdAt: '2026-05-02T16:45:00.000Z',
  },
  {
    id: 'booking_demo_4',
    clientId: 'client_demo_2',
    fullName: 'Youssef Trabelsi',
    email: 'youssef.trabelsi@mail.tn',
    phone: '+216 55 300 414',
    city: 'Sfax',
    eventType: 'Anniversaire',
    eventDate: '2026-05-26',
    location: 'Route Gremda',
    guestsCount: 70,
    budget: '500 DT - 1000 DT',
    requestedServices: ['DJ', 'Photographe'],
    preferredProvider: 'Atlas Beat Collective',
    message: 'Format lounge avec eclairage violet et rose.',
    status: 'Annulee',
    estimatedBudgetValue: 750,
    createdAt: '2026-05-05T10:25:00.000Z',
  },
];

const normalizeClient = (client: ClientUser): ClientUser => ({
  ...client,
  city: client.city ?? '',
  avatarUrl: client.avatarUrl ?? '',
});

const normalizeProvider = (provider: Provider): Provider => ({
  ...provider,
  instagram: provider.instagram || 'https://instagram.com/',
});

const normalizeService = (service: ServiceItem): ServiceItem => ({
  ...service,
  active: typeof service.active === 'boolean' ? service.active : true,
  createdAt: service.createdAt || nowISO(),
});

const setCurrentUser = (user: ClientUser | null) => {
  if (!user) {
    safeStorage.removeItem(STORAGE_KEYS.currentUser);
    return;
  }

  setJSON(STORAGE_KEYS.currentUser, normalizeClient(user));
};

const migrateLegacyAuthStorage = () => {
  const hasUsers = Boolean(safeStorage.getItem(STORAGE_KEYS.users));
  const legacyUsers = safeStorage.getItem(LEGACY_STORAGE_KEYS.clients);

  if (!hasUsers && legacyUsers) {
    safeStorage.setItem(STORAGE_KEYS.users, legacyUsers);
  }

  const hasCurrentUser = Boolean(safeStorage.getItem(STORAGE_KEYS.currentUser));
  const legacyCurrentId = safeStorage.getItem(LEGACY_STORAGE_KEYS.currentClientId);

  if (!hasCurrentUser && legacyCurrentId) {
    const users = parseJSONArray<ClientUser>(safeStorage.getItem(STORAGE_KEYS.users), []);
    const matched = users.find((user) => user.id === legacyCurrentId) ?? null;
    if (matched) {
      setCurrentUser(matched);
    }
  }

  safeStorage.removeItem(LEGACY_STORAGE_KEYS.clients);
  safeStorage.removeItem(LEGACY_STORAGE_KEYS.currentClientId);
};

export const initializeStorage = () => {
  migrateLegacyAuthStorage();

  const hasProviders = safeStorage.getItem(STORAGE_KEYS.providers);
  if (!hasProviders) {
    setJSON(STORAGE_KEYS.providers, DEMO_PROVIDERS);
  } else {
    const providers = parseJSONArray<Provider>(hasProviders, DEMO_PROVIDERS).map(normalizeProvider);
    setJSON(STORAGE_KEYS.providers, providers);
  }

  const hasUsers = safeStorage.getItem(STORAGE_KEYS.users);
  if (!hasUsers) {
    setJSON(STORAGE_KEYS.users, demoClients);
  } else {
    const users = parseJSONArray<ClientUser>(hasUsers, demoClients).map(normalizeClient);
    setJSON(STORAGE_KEYS.users, users);
  }

  const hasBookings = safeStorage.getItem(STORAGE_KEYS.bookings);
  if (!hasBookings) {
    setJSON(STORAGE_KEYS.bookings, demoBookings);
  }

  const hasServices = safeStorage.getItem(STORAGE_KEYS.services);
  if (!hasServices) {
    setJSON(STORAGE_KEYS.services, defaultServiceItems);
  } else {
    const services = parseJSONArray<ServiceItem>(hasServices, defaultServiceItems).map(normalizeService);
    setJSON(STORAGE_KEYS.services, services);
  }

  const hasSettings = safeStorage.getItem(STORAGE_KEYS.agencySettings);
  if (!hasSettings) {
    setJSON(STORAGE_KEYS.agencySettings, DEFAULT_AGENCY_SETTINGS);
  } else {
    const settings = parseJSONObject<AgencySettings>(hasSettings, DEFAULT_AGENCY_SETTINGS);
    setJSON(STORAGE_KEYS.agencySettings, { ...DEFAULT_AGENCY_SETTINGS, ...settings });
  }
};

export const getClients = (): ClientUser[] =>
  parseJSONArray<ClientUser>(safeStorage.getItem(STORAGE_KEYS.users), []).map(normalizeClient);

const setClients = (clients: ClientUser[]) =>
  setJSON(
    STORAGE_KEYS.users,
    clients.map((client) => normalizeClient(client)),
  );

export const getBookings = (): Booking[] => parseJSONArray<Booking>(safeStorage.getItem(STORAGE_KEYS.bookings), []);

const setBookings = (bookings: Booking[]) => setJSON(STORAGE_KEYS.bookings, bookings);

export const getProviders = (): Provider[] =>
  parseJSONArray<Provider>(safeStorage.getItem(STORAGE_KEYS.providers), DEMO_PROVIDERS).map(normalizeProvider);

const setProviders = (providers: Provider[]) =>
  setJSON(
    STORAGE_KEYS.providers,
    providers.map((provider) => normalizeProvider(provider)),
  );

export const getServices = (): ServiceItem[] =>
  parseJSONArray<ServiceItem>(safeStorage.getItem(STORAGE_KEYS.services), defaultServiceItems).map(normalizeService);

const setServices = (services: ServiceItem[]) =>
  setJSON(
    STORAGE_KEYS.services,
    services.map((service) => normalizeService(service)),
  );

export const getAgencySettings = (): AgencySettings => {
  const stored = parseJSONObject<AgencySettings>(
    safeStorage.getItem(STORAGE_KEYS.agencySettings),
    DEFAULT_AGENCY_SETTINGS,
  );
  return { ...DEFAULT_AGENCY_SETTINGS, ...stored };
};

export const updateAgencySettings = (payload: AgencySettings) => {
  const normalized: AgencySettings = {
    agencyName: payload.agencyName.trim(),
    agencyEmail: payload.agencyEmail.trim().toLowerCase(),
    whatsappNumber: payload.whatsappNumber.trim(),
    instagramLink: payload.instagramLink.trim(),
    facebookLink: payload.facebookLink.trim(),
  };

  setJSON(STORAGE_KEYS.agencySettings, normalized);
  return normalized;
};

export const registerClient = (
  payload: RegisterPayload,
): { ok: boolean; message: string; user?: ClientUser } => {
  const clients = getClients();
  const existing = clients.find(
    (client) => client.email.trim().toLowerCase() === payload.email.trim().toLowerCase(),
  );

  if (existing) {
    return { ok: false, message: 'Cet email est deja utilise.' };
  }

  const user: ClientUser = {
    id: createId('client'),
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    password: payload.password,
    createdAt: nowISO(),
    city: '',
    avatarUrl: '',
  };

  setClients([user, ...clients]);
  setCurrentUser(user);

  return { ok: true, message: 'Compte cree avec succes.', user };
};

export const loginClient = (
  payload: LoginPayload,
): { ok: boolean; message: string; user?: ClientUser } => {
  const clients = getClients();
  const user = clients.find(
    (client) =>
      client.email.trim().toLowerCase() === payload.email.trim().toLowerCase() &&
      client.password === payload.password,
  );

  if (!user) {
    return { ok: false, message: 'Email ou mot de passe invalide.' };
  }

  setCurrentUser(user);
  return { ok: true, message: 'Connexion reussie.', user };
};

export const logoutClient = () => {
  setCurrentUser(null);
};

export const getCurrentClient = (): ClientUser | null => {
  const storedUser = parseNullableObject<ClientUser>(safeStorage.getItem(STORAGE_KEYS.currentUser));
  if (!storedUser) return null;
  if (typeof storedUser.id !== 'string' || typeof storedUser.email !== 'string') {
    setCurrentUser(null);
    return null;
  }

  const clients = getClients();
  const freshUser =
    clients.find((client) => client.id === storedUser.id) ??
    clients.find((client) => client.email.trim().toLowerCase() === storedUser.email.trim().toLowerCase()) ??
    null;

  if (!freshUser) {
    setCurrentUser(null);
    return null;
  }

  setCurrentUser(freshUser);
  return freshUser;
};

export const updateClientProfile = (
  clientId: string,
  updates: Pick<ClientUser, 'fullName' | 'phone' | 'city' | 'avatarUrl'>,
): ClientUser | null => {
  const clients = getClients();
  const index = clients.findIndex((client) => client.id === clientId);
  if (index === -1) return null;

  const updatedClient = normalizeClient({
    ...clients[index],
    fullName: updates.fullName.trim(),
    phone: updates.phone.trim(),
    city: updates.city?.trim() || '',
    avatarUrl: updates.avatarUrl?.trim() || '',
  });

  clients[index] = updatedClient;
  setClients(clients);

  const currentClient = getCurrentClient();
  if (currentClient?.id === updatedClient.id) {
    setCurrentUser(updatedClient);
  }

  return updatedClient;
};

export const loginAdmin = (payload: LoginPayload) => {
  const isValid =
    payload.email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
    payload.password === ADMIN_CREDENTIALS.password;

  if (isValid) {
    safeStorage.setItem(STORAGE_KEYS.adminSession, 'true');
    return { ok: true, message: 'Session admin activee.' };
  }

  return { ok: false, message: 'Identifiants admin invalides.' };
};

export const logoutAdmin = () => {
  safeStorage.removeItem(STORAGE_KEYS.adminSession);
};

export const isAdminAuthenticated = () => safeStorage.getItem(STORAGE_KEYS.adminSession) === 'true';

export const addBooking = (
  clientId: string,
  values: BookingFormValues,
): { booking: Booking; allBookings: Booking[] } => {
  const bookings = getBookings();

  const booking: Booking = {
    id: createId('booking'),
    clientId,
    fullName: values.fullName,
    email: values.email.toLowerCase(),
    phone: values.phone,
    city: values.city,
    eventType: values.eventType,
    eventDate: values.eventDate,
    location: values.location,
    guestsCount: Number(values.guestsCount),
    budget: values.budget,
    requestedServices: values.requestedServices,
    preferredProvider: values.preferredProvider,
    message: values.message,
    status: 'Nouvelle demande',
    estimatedBudgetValue: BUDGET_TO_VALUE[values.budget] ?? 0,
    createdAt: nowISO(),
  };

  const next = [booking, ...bookings];
  setBookings(next);
  return { booking, allBookings: next };
};

export const getBookingsByClient = (clientId: string) =>
  getBookings().filter((booking) => booking.clientId === clientId);

export const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
  const bookings = getBookings();
  const index = bookings.findIndex((booking) => booking.id === bookingId);

  if (index === -1) return null;

  const updated = { ...bookings[index], status };
  bookings[index] = updated;
  setBookings(bookings);

  return updated;
};

export const deleteBooking = (bookingId: string) => {
  const bookings = getBookings();
  const next = bookings.filter((booking) => booking.id !== bookingId);
  setBookings(next);
  return next;
};

export const addProvider = (payload: Omit<Provider, 'id' | 'createdAt'>) => {
  const providers = getProviders();
  const provider: Provider = normalizeProvider({
    id: createId('provider'),
    createdAt: nowISO(),
    ...payload,
  });

  const next = [provider, ...providers];
  setProviders(next);
  return provider;
};

export const updateProvider = (providerId: string, payload: Omit<Provider, 'id' | 'createdAt'>) => {
  const providers = getProviders();
  const index = providers.findIndex((provider) => provider.id === providerId);
  if (index === -1) return null;

  const updated: Provider = normalizeProvider({
    ...providers[index],
    ...payload,
  });

  providers[index] = updated;
  setProviders(providers);
  return updated;
};

export const toggleProviderAvailability = (providerId: string) => {
  const providers = getProviders();
  const index = providers.findIndex((provider) => provider.id === providerId);
  if (index === -1) return null;

  const updated: Provider = {
    ...providers[index],
    available: !providers[index].available,
  };

  providers[index] = updated;
  setProviders(providers);
  return updated;
};

export const deleteProvider = (providerId: string) => {
  const providers = getProviders();
  const next = providers.filter((provider) => provider.id !== providerId);
  setProviders(next);
  return next;
};

export const addService = (payload: Omit<ServiceItem, 'id' | 'createdAt'>) => {
  const services = getServices();
  const service: ServiceItem = normalizeService({
    id: createId('service'),
    createdAt: nowISO(),
    ...payload,
  });

  const next = [service, ...services];
  setServices(next);
  return service;
};

export const updateService = (serviceId: string, payload: Omit<ServiceItem, 'id' | 'createdAt'>) => {
  const services = getServices();
  const index = services.findIndex((service) => service.id === serviceId);
  if (index === -1) return null;

  const updated: ServiceItem = normalizeService({
    ...services[index],
    ...payload,
  });

  services[index] = updated;
  setServices(services);
  return updated;
};

export const toggleServiceActive = (serviceId: string) => {
  const services = getServices();
  const index = services.findIndex((service) => service.id === serviceId);
  if (index === -1) return null;

  const updated: ServiceItem = {
    ...services[index],
    active: !services[index].active,
  };

  services[index] = updated;
  setServices(services);
  return updated;
};

export const deleteService = (serviceId: string) => {
  const services = getServices();
  const next = services.filter((service) => service.id !== serviceId);
  setServices(next);
  return next;
};

export const countBookingsForClient = (clientId: string) =>
  getBookings().filter((booking) => booking.clientId === clientId).length;

export const getLastBookingForClient = (clientId: string) => {
  const bookings = getBookingsByClient(clientId);
  return bookings[0] ?? null;
};

export const getStorageKeys = () => STORAGE_KEYS;

