import { api } from '../lib/api';
import type { ServiceItemRequest, ServiceItemResponse } from '../types/service';

export const getPublicServices = async (): Promise<ServiceItemResponse[]> => {
  const response = await api.get<ServiceItemResponse[]>('/public/services');
  return response.data;
};

export const getAdminServices = async (): Promise<ServiceItemResponse[]> => {
  const response = await api.get<ServiceItemResponse[]>('/admin/services');
  return response.data;
};

export const createService = async (data: ServiceItemRequest): Promise<ServiceItemResponse> => {
  const response = await api.post<ServiceItemResponse>('/admin/services', data);
  return response.data;
};

export const updateService = async (id: number, data: ServiceItemRequest): Promise<ServiceItemResponse> => {
  const response = await api.put<ServiceItemResponse>(`/admin/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: number): Promise<void> => {
  await api.delete(`/admin/services/${id}`);
};

