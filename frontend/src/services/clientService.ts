import { getClients as getClientsFromStorage, updateClientProfile } from '../lib/storage';
import type { ClientUser } from '../types';

export type ClientUpdatePayload = Pick<ClientUser, 'fullName' | 'phone' | 'city' | 'avatarUrl'>;

export const getClients = (): ClientUser[] => {
  return getClientsFromStorage();
};

export const getClientById = (id: string): ClientUser | null => {
  const clients = getClientsFromStorage();
  return clients.find((client) => client.id === id) ?? null;
};

export const updateClient = (id: string, data: ClientUpdatePayload): ClientUser | null => {
  return updateClientProfile(id, data);
};
