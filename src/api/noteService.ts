import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { Note, NoteStatus, Payment } from '@/src/types';

const COLLECTION = 'notas';

const toNote = (id: string, data: Record<string, unknown>): Note => ({
  id,
  id_cliente: data.id_cliente as string,
  folio: data.folio as string,
  conceptos: data.conceptos as Note['conceptos'],
  subtotal: data.subtotal as number,
  iva: data.iva as number,
  requiereFactura: data.requiereFactura as boolean,
  total: data.total as number,
  anticipo: data.anticipo as number,
  saldoPendiente: data.saldoPendiente as number,
  abonos: (data.abonos as Payment[]) ?? [],
  status: data.status as NoteStatus,
  createdAt: (data.createdAt as Timestamp).toDate(),
  updatedAt: (data.updatedAt as Timestamp).toDate(),
});

export const noteService = {
  getAll: async (): Promise<Note[]> => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => toNote(d.id, d.data() as Record<string, unknown>));
  },

  getByClient: async (clientId: string): Promise<Note[]> => {
    const q = query(
      collection(db, COLLECTION),
      where('id_cliente', '==', clientId),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => toNote(d.id, d.data() as Record<string, unknown>));
  },

  getById: async (id: string): Promise<Note | null> => {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return toNote(snap.id, snap.data() as Record<string, unknown>);
  },

  create: async (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    const now = new Date();
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    return toNote(ref.id, {
      ...data,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
  },

  updateStatus: async (id: string, status: NoteStatus): Promise<void> => {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { status, updatedAt: Timestamp.fromDate(new Date()) });
  },

  addPayment: async (noteId: string, payment: Payment): Promise<void> => {
    const ref = doc(db, COLLECTION, noteId);
    await updateDoc(ref, {
      abonos: arrayUnion(payment),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  updateSaldo: async (noteId: string, saldoPendiente: number): Promise<void> => {
    const ref = doc(db, COLLECTION, noteId);
    await updateDoc(ref, { saldoPendiente, updatedAt: Timestamp.fromDate(new Date()) });
  },

  update: async (id: string, data: Partial<Note>): Promise<void> => {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...data, updatedAt: Timestamp.fromDate(new Date()) });
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
