import { api } from '../lib/api';
import type { AdminClientResponse, DashboardStatsResponse } from '../types/admin';

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await api.get<DashboardStatsResponse>('/admin/dashboard/stats');
  return response.data;
};

export const getClients = async (): Promise<AdminClientResponse[]> => {
  const response = await api.get<AdminClientResponse[]>('/admin/clients');
  return response.data;
};

export const getClient = async (id: number): Promise<AdminClientResponse> => {
  const response = await api.get<AdminClientResponse>(`/admin/clients/${id}`);
  return response.data;
};

export const updateClientActive = async (id: number, active: boolean): Promise<AdminClientResponse> => {
  const response = await api.patch<AdminClientResponse>(`/admin/clients/${id}/active`, { active });
  return response.data;
};

