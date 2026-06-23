import { create } from 'zustand';
import { Client } from '@/src/types';

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  setClients: (clients: Client[]) => void;
  setSelectedClient: (client: Client | null) => void;
  setLoading: (loading: boolean) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  selectedClient: null,
  loading: false,
  setClients: (clients) => set({ clients }),
  setSelectedClient: (client) => set({ selectedClient: client }),
  setLoading: (loading) => set({ loading }),
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (id, data) =>
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
      selectedClient:
        state.selectedClient?.id === id ? { ...state.selectedClient, ...data } : state.selectedClient,
    })),
}));
