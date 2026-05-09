import { api } from '../lib/api';
import type { ProviderRequest, ProviderResponse } from '../types/provider';

const getAdminProviderById = async (id: number): Promise<ProviderResponse> => {
  const response = await api.get<ProviderResponse>(`/admin/providers/${id}`);
  return response.data;
};

export const getPublicProviders = async (): Promise<ProviderResponse[]> => {
  const response = await api.get<ProviderResponse[]>('/public/providers');
  return response.data;
};

export const getPublicProvider = async (id: number): Promise<ProviderResponse> => {
  const response = await api.get<ProviderResponse>(`/public/providers/${id}`);
  return response.data;
};

export const getAdminProviders = async (): Promise<ProviderResponse[]> => {
  const response = await api.get<ProviderResponse[]>('/admin/providers');
  return response.data;
};

export const createProvider = async (data: ProviderRequest): Promise<ProviderResponse> => {
  const response = await api.post<ProviderResponse>('/admin/providers', data);
  return response.data;
};

export const updateProvider = async (id: number, data: ProviderRequest): Promise<ProviderResponse> => {
  const response = await api.put<ProviderResponse>(`/admin/providers/${id}`, data);
  return response.data;
};

export const deleteProvider = async (id: number): Promise<void> => {
  await api.delete(`/admin/providers/${id}`);
};

export const toggleAvailability = async (id: number, available: boolean): Promise<ProviderResponse> => {
  const current = await getAdminProviderById(id);
  if (current.available === available) {
    return current;
  }

  const response = await api.patch<ProviderResponse>(`/admin/providers/${id}/availability`);
  return response.data;
};

