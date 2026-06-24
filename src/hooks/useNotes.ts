import { useCallback } from 'react';
import { useNoteStore } from '@/src/stores';
import { noteService } from '@/src/api';
import { NoteStatus, Payment, WorkConcept } from '@/src/types';

export function useNotes() {
  const { notes, selectedNote, loading, setNotes, setSelectedNote, setLoading, addNote, updateNote, removeNote } =
    useNoteStore();

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await noteService.getAll();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  }, [setNotes, setLoading]);

  const fetchNote = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const data = await noteService.getById(id);
        setSelectedNote(data);
      } finally {
        setLoading(false);
      }
    },
    [setSelectedNote, setLoading],
  );

  const createNote = useCallback(
    async (data: {
      id_cliente: string;
      conceptos: WorkConcept[];
      requiereFactura: boolean;
      anticipo: number;
    }) => {
      const subtotal = data.conceptos.reduce((sum, c) => sum + c.precio, 0);
      const iva = data.requiereFactura ? subtotal * 0.16 : 0;
      const total = subtotal + iva;
      const saldoPendiente = total - data.anticipo;

      const note = await noteService.create({
        id_cliente: data.id_cliente,
        folio: '', // TODO: generar folio
        conceptos: data.conceptos,
        subtotal,
        iva,
        requiereFactura: data.requiereFactura,
        total,
        anticipo: data.anticipo,
        saldoPendiente,
        abonos: data.anticipo > 0
          ? [{ id: '', monto: data.anticipo, metodo: 'EFECTIVO', fecha: new Date() }]
          : [],
        status: 'PENDIENTE',
      });

      addNote(note);
      return note;
    },
    [addNote],
  );

  const updateStatus = useCallback(
    async (id: string, status: NoteStatus) => {
      await noteService.updateStatus(id, status);
      updateNote(id, { status });
    },
    [updateNote],
  );

  const addPayment = useCallback(
    async (noteId: string, payment: Payment) => {
      await noteService.addPayment(noteId, payment);

      const note = notes.find((n) => n.id === noteId) || selectedNote;
      if (!note) return;

      const nuevosAbonos = [...note.abonos, payment];
      const totalPagado = nuevosAbonos.reduce((sum, p) => sum + p.monto, 0);
      const nuevoSaldo = note.total - totalPagado;

      updateNote(noteId, {
        abonos: nuevosAbonos,
        saldoPendiente: nuevoSaldo,
        status: nuevoSaldo <= 0 ? 'PAGADA_SIN_ENTREGAR' : note.status,
      });
    },
    [notes, selectedNote, updateNote],
  );

  const cancelNote = useCallback(
    async (noteId: string, costInversion: number) => {
      const note = notes.find((n) => n.id === noteId) || selectedNote;
      if (!note) return;

      const resultado = note.anticipo - costInversion;
      const nuevoSaldo = resultado < 0 ? Math.abs(resultado) : 0;

      await noteService.update(noteId, {
        status: 'CANCELADA',
        saldoPendiente: nuevoSaldo,
      });
      updateNote(noteId, {
        status: 'CANCELADA',
        saldoPendiente: nuevoSaldo,
      });
    },
    [notes, selectedNote, updateNote],
  );

  return {
    notes,
    selectedNote,
    loading,
    fetchNotes,
    fetchNote,
    createNote,
    updateStatus,
    addPayment,
    cancelNote,
    removeNote,
  };
}
