import { Client } from '@/src/types';

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    // TODO: implementar con Firebase
    return [];
  },

  getById: async (id: string): Promise<Client | null> => {
    // TODO: implementar con Firebase
    return null;
  },

  create: async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
    // TODO: implementar con Firebase
    return {} as Client;
  },

  update: async (id: string, data: Partial<Client>): Promise<void> => {
    // TODO: implementar con Firebase
  },

  delete: async (id: string): Promise<void> => {
    // TODO: implementar con Firebase
  },
};
