import {
  addService,
  deleteService,
  getAgencySettings,
  getServices,
  getStorageKeys,
  initializeStorage,
  toggleServiceActive,
  updateAgencySettings,
  updateService,
} from '../lib/storage';
import { safeStorage } from '../lib/safe-storage';
import type { AgencySettings, ServiceItem } from '../types';

export type ServicePayload = Omit<ServiceItem, 'id' | 'createdAt'>;

export const initializeAppData = () => {
  initializeStorage();
};

export const getSettings = (): AgencySettings => {
  return getAgencySettings();
};

export const updateSettings = (data: AgencySettings) => {
  return updateAgencySettings(data);
};

export const resetPlatformData = () => {
  const keys = getStorageKeys();

  safeStorage.removeItem(keys.clients);
  safeStorage.removeItem(keys.bookings);
  safeStorage.removeItem(keys.providers);
  safeStorage.removeItem(keys.services);
  safeStorage.removeItem(keys.agencySettings);
  safeStorage.removeItem(keys.currentClientId);
  safeStorage.removeItem(keys.adminSession);

  initializeStorage();
};

export const getServicesCatalog = () => {
  return getServices();
};

export const createService = (data: ServicePayload) => {
  return addService(data);
};

export const updateServiceById = (id: string, data: ServicePayload) => {
  return updateService(id, data);
};

export const deleteServiceById = (id: string) => {
  return deleteService(id);
};

export const setServiceActiveState = (id: string, active: boolean) => {
  const services = getServices();
  const service = services.find((item) => item.id === id);
  if (!service) return null;

  if (service.active === active) return service;

  return toggleServiceActive(id);
};
