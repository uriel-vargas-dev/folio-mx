import { create } from 'zustand';
import { Note } from '@/src/types';

interface NoteState {
  notes: Note[];
  selectedNote: Note | null;
  loading: boolean;
  setNotes: (notes: Note[]) => void;
  setSelectedNote: (note: Note | null) => void;
  setLoading: (loading: boolean) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  removeNote: (id: string) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  selectedNote: null,
  loading: false,
  setNotes: (notes) => set({ notes }),
  setSelectedNote: (note) => set({ selectedNote: note }),
  setLoading: (loading) => set({ loading }),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (id, data) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...data } : n)),
      selectedNote:
        state.selectedNote?.id === id ? { ...state.selectedNote, ...data } : state.selectedNote,
    })),
  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
    })),
}));
