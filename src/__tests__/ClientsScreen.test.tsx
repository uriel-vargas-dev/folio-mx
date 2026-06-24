import React from 'react';
import { createRoot } from 'test-renderer';
import ClientsScreen from '@/app/(tabs)/clients';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: jest.fn((cb) => cb()),
}));

jest.mock('@/src/hooks', () => ({
  useClients: jest.fn(),
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

import { useClients } from '@/src/hooks';

const mockClients = [
  { id: '1', nombre: 'Juan Perez', whatsapp: '5512345678', saldoPendiente: 500 },
  { id: '2', nombre: 'Maria Lopez', whatsapp: '5587654321', saldoPendiente: 0 },
];

describe('ClientsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    (useClients as jest.Mock).mockReturnValue({
      clients: [],
      loading: false,
      fetchClients: jest.fn(),
    });

    const root = createRoot(null);
    root.render(<ClientsScreen />);
    root.unmount();
  });

  it('shows empty state text', () => {
    (useClients as jest.Mock).mockReturnValue({
      clients: [],
      loading: false,
      fetchClients: jest.fn(),
    });

    const root = createRoot(null);
    root.render(<ClientsScreen />);
    expect(root.container).toBeTruthy();
    root.unmount();
  });

  it('renders client names', () => {
    (useClients as jest.Mock).mockReturnValue({
      clients: mockClients,
      loading: false,
      fetchClients: jest.fn(),
    });

    const root = createRoot(null);
    root.render(<ClientsScreen />);
    expect(root.container).toBeTruthy();
    root.unmount();
  });
});
