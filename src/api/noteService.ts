import { Note, NoteStatus, Payment } from '@/src/types';

export const noteService = {
  getAll: async (): Promise<Note[]> => {
    // TODO: implementar con Firebase
    return [];
  },

  getByClient: async (clientId: string): Promise<Note[]> => {
    // TODO: implementar con Firebase
    return [];
  },

  getById: async (id: string): Promise<Note | null> => {
    // TODO: implementar con Firebase
    return null;
  },

  create: async (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    // TODO: implementar con Firebase
    return {} as Note;
  },

  updateStatus: async (id: string, status: NoteStatus): Promise<void> => {
    // TODO: implementar con Firebase
  },

  addPayment: async (noteId: string, payment: Payment): Promise<void> => {
    // TODO: implementar con Firebase (arrayUnion)
  },

  cancel: async (noteId: string, costInversion: number): Promise<void> => {
    // TODO: implementar con Firebase
  },

  delete: async (id: string): Promise<void> => {
    // TODO: implementar con Firebase
  },
};
