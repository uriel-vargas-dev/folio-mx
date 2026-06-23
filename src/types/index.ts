export type NoteStatus =
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'PAGADA_SIN_ENTREGAR'
  | 'ENTREGADA'
  | 'CANCELADA';

export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA';

export interface WorkConcept {
  id: string;
  descripcion: string;
  precio: number;
}

export interface Payment {
  id: string;
  monto: number;
  metodo: PaymentMethod;
  fecha: Date;
}

export interface Client {
  id: string;
  nombre: string;
  whatsapp: string;
  createdAt: Date;
  updatedAt: Date;
  saldoPendiente: number;
}

export interface Note {
  id: string;
  id_cliente: string;
  clienteNombre?: string;
  folio: string;
  conceptos: WorkConcept[];
  subtotal: number;
  iva: number;
  requiereFactura: boolean;
  total: number;
  anticipo: number;
  saldoPendiente: number;
  abonos: Payment[];
  status: NoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardSummary {
  totalNotasPendientes: number;
  totalNotasEnProceso: number;
  totalNotasTerminadas: number;
  totalPorCobrar: number;
}
