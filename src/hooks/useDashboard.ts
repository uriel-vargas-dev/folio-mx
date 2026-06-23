import { useMemo } from 'react';
import { useNoteStore } from '@/src/stores';
import { DashboardSummary } from '@/src/types';

export function useDashboard(): DashboardSummary {
  const notes = useNoteStore((state) => state.notes);

  return useMemo(
    () => ({
      totalNotasPendientes: notes.filter((n) => n.status === 'PENDIENTE' || n.status === 'EN_PROCESO').length,
      totalNotasEnProceso: notes.filter((n) => n.status === 'EN_PROCESO').length,
      totalNotasTerminadas: notes.filter((n) => n.status === 'ENTREGADA').length,
      totalPorCobrar: notes
        .filter((n) => n.status !== 'ENTREGADA' && n.status !== 'CANCELADA')
        .reduce((sum, n) => sum + n.saldoPendiente, 0),
    }),
    [notes],
  );
}
