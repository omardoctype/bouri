export interface ServiceItemRequest {
  name: string;
  category: string;
  description: string;
  active: boolean;
}

export interface ServiceItemResponse {
  id: number;
  name: string;
  category: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

