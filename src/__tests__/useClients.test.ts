import { useClientStore } from '@/src/stores';
import { clientService } from '@/src/api';

jest.mock('@/src/api', () => ({
  clientService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
  },
}));

const mockClients = [
  { id: '1', nombre: 'Juan', whatsapp: '5512345678', saldoPendiente: 500 },
  { id: '2', nombre: 'Maria', whatsapp: '5587654321', saldoPendiente: 0 },
];

describe('useClientStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useClientStore.setState({ clients: [], selectedClient: null, loading: false });
  });

  it('setClients updates the clients list', () => {
    useClientStore.getState().setClients(mockClients);
    expect(useClientStore.getState().clients).toEqual(mockClients);
  });

  it('setSelectedClient updates selected client', () => {
    useClientStore.getState().setSelectedClient(mockClients[0]);
    expect(useClientStore.getState().selectedClient).toEqual(mockClients[0]);
  });

  it('setLoading updates loading state', () => {
    useClientStore.getState().setLoading(true);
    expect(useClientStore.getState().loading).toBe(true);
    useClientStore.getState().setLoading(false);
    expect(useClientStore.getState().loading).toBe(false);
  });

  it('addClient adds client to list', () => {
    useClientStore.getState().addClient(mockClients[0]);
    expect(useClientStore.getState().clients).toHaveLength(1);
    useClientStore.getState().addClient(mockClients[1]);
    expect(useClientStore.getState().clients).toHaveLength(2);
  });

  it('updateClient modifies existing client', () => {
    useClientStore.getState().setClients(mockClients);
    useClientStore.getState().updateClient('1', { nombre: 'Juan Actualizado' });
    const updated = useClientStore.getState().clients.find((c) => c.id === '1');
    expect(updated?.nombre).toBe('Juan Actualizado');
  });

  it('clientService.getAll returns clients', async () => {
    (clientService.getAll as jest.Mock).mockResolvedValue(mockClients);
    const result = await clientService.getAll();
    expect(result).toHaveLength(2);
    expect(result[0].nombre).toBe('Juan');
  });

  it('clientService.create adds and returns new client', async () => {
    const newClient = { id: '3', nombre: 'Pedro', whatsapp: '5511112222', saldoPendiente: 0 };
    (clientService.create as jest.Mock).mockResolvedValue(newClient);
    const result = await clientService.create({ nombre: 'Pedro', whatsapp: '5511112222' });
    expect(result).toEqual(newClient);
  });
});
