import { api } from '../lib/api';
import type { AppSettingsRequest, AppSettingsResponse } from '../types/settings';

export const getSettings = async (): Promise<AppSettingsResponse> => {
  const response = await api.get<AppSettingsResponse>('/admin/settings');
  return response.data;
};

export const updateSettings = async (data: AppSettingsRequest): Promise<AppSettingsResponse> => {
  const response = await api.put<AppSettingsResponse>('/admin/settings', data);
  return response.data;
};

