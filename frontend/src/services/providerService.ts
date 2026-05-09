import {
  addProvider,
  deleteProvider as deleteProviderInStorage,
  getProviders as getProvidersFromStorage,
  toggleProviderAvailability,
  updateProvider as updateProviderInStorage,
} from '../lib/storage';
import type { Provider } from '../types';

export type ProviderPayload = Omit<Provider, 'id' | 'createdAt'>;

export const getProviders = () => {
  return getProvidersFromStorage();
};

export const createProvider = (data: ProviderPayload) => {
  return addProvider(data);
};

export const updateProvider = (id: string, data: ProviderPayload) => {
  return updateProviderInStorage(id, data);
};

export const deleteProvider = (id: string) => {
  return deleteProviderInStorage(id);
};

export const setProviderAvailability = (id: string, available: boolean) => {
  const providers = getProvidersFromStorage();
  const provider = providers.find((item) => item.id === id);
  if (!provider) return null;

  if (provider.available === available) return provider;

  return toggleProviderAvailability(id);
};
