import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { Client } from '@/src/types';

const COLLECTION = 'clientes';

const toClient = (id: string, data: Record<string, unknown>): Client => ({
  id,
  nombre: data.nombre as string,
  whatsapp: data.whatsapp as string,
  createdAt: (data.createdAt as Timestamp).toDate(),
  updatedAt: (data.updatedAt as Timestamp).toDate(),
  saldoPendiente: (data.saldoPendiente as number) ?? 0,
});

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const q = query(collection(db, COLLECTION), orderBy('nombre'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => toClient(d.id, d.data() as Record<string, unknown>));
  },

  getById: async (id: string): Promise<Client | null> => {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return toClient(snap.id, snap.data() as Record<string, unknown>);
  },

  create: async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
    const now = new Date();
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      saldoPendiente: 0,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    return toClient(ref.id, {
      ...data,
      saldoPendiente: 0,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
  },

  update: async (id: string, data: Partial<Client>): Promise<void> => {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...data, updatedAt: Timestamp.fromDate(new Date()) });
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
