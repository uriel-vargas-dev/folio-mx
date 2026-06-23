import { useCallback } from 'react';
import { useClientStore } from '@/src/stores';
import { clientService } from '@/src/api';
import { Client } from '@/src/types';

export function useClients() {
  const { clients, selectedClient, loading, setClients, setSelectedClient, setLoading, addClient, updateClient } =
    useClientStore();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientService.getAll();
      setClients(data);
    } finally {
      setLoading(false);
    }
  }, [setClients, setLoading]);

  const fetchClient = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const data = await clientService.getById(id);
        setSelectedClient(data);
      } finally {
        setLoading(false);
      }
    },
    [setSelectedClient, setLoading],
  );

  const createClient = useCallback(
    async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
      const client = await clientService.create(data);
      addClient(client);
      return client;
    },
    [addClient],
  );

  return {
    clients,
    selectedClient,
    loading,
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
  };
}
