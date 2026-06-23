# Folio MX - Sistema de Gestión de Taller

Sistema móvil para digitalizar y optimizar la gestión de notas, anticipos y entregas de un taller especializado en pulido y cromado de piezas.

## Stack Tecnológico

| Capa        | Tecnología                                |
| ----------- | ----------------------------------------- |
| Framework   | React Native + Expo ~54.0.34             |
| Navegación  | expo-router (file-based routing)          |
| Estado      | Zustand                                   |
| BD          | Firebase (Cloud Firestore)                |
| PDF         | expo-print                                |
| WhatsApp    | Linking API (wa.me)                       |
| Validación  | Zod                                       |

## Arquitectura por Capas

```
Pantallas (screens) → Hooks → API (Firebase) → Firestore
       ↓                                    ↓
  Componentes UI                      Tipos/Modelos
```

### Responsabilidades

| Carpeta               | Propósito                                               |
| --------------------- | ------------------------------------------------------- |
| `src/types/`          | Interfaces TypeScript (Client, Note, WorkConcept, etc.) |
| `src/config/`         | Inicialización Firebase, entorno                        |
| `src/api/`            | Única capa que habla con Firestore                      |
| `src/hooks/`          | Lógica de negocio (IVA, cancelaciones, saldos)          |
| `src/stores/`         | Estado global con Zustand (auth, clients, notes)        |
| `src/components/common/` | Componentes visuales reutilizables (Button, Input)   |
| `src/components/forms/`  | Componentes de formulario (ClientForm, NoteForm)     |
| `app/`                | Rutas y pantallas con expo-router                       |
| `src/utils/`          | Funciones puras (formatCurrency, dateHelpers)           |

## Modelo de Datos (Firestore)

### Colección `clientes`
```
{
  id: string,
  nombre: string,
  whatsapp: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  saldoPendiente: number
}
```

### Colección `notas`
```
{
  id: string,
  id_cliente: string,
  folio: string,
  conceptos: [{ id, descripcion, precio }],
  subtotal: number,
  iva: number,
  requiereFactura: boolean,
  total: number,
  anticipo: number,
  saldoPendiente: number,
  abonos: [{ id, monto, metodo, fecha }],
  status: NoteStatus,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Ciclo de Vida de una Nota

```
PENDIENTE ──→ EN_PROCESO ──→ PAGADA_SIN_ENTREGAR ──→ ENTREGADA
    │              │                  │
    └──────────────┴──────────────────┴──→ CANCELADA
```

| Estado               | Significado                                   |
| -------------------- | --------------------------------------------- |
| `PENDIENTE`          | Creada, sin trabajo iniciado                  |
| `EN_PROCESO`         | Trabajo en curso                              |
| `PAGADA_SIN_ENTREGAR`| Pagada en su totalidad, lista para recoger    |
| `ENTREGADA`          | Entregada al cliente                          |
| `CANCELADA`          | Cancelada con liquidación financiera          |

## Estructura de Rutas (expo-router)

```
app/
  _layout.tsx                    Root Stack
  (tabs)/
    _layout.tsx                  Bottom Tabs
    index.tsx                    Dashboard (resumen)
    clients.tsx                  Lista de clientes
    notes.tsx                    Lista de notas
  client/
    [id].tsx                     Detalle del cliente + historial
    new.tsx                      Registrar cliente nuevo
  note/
    [id].tsx                     Detalle de nota (abonos, estados, WhatsApp, cancelar)
    new.tsx                      Crear nota (conceptos, IVA, anticipo)
```

## Funcionalidades del MVP

1. **Registro de clientes** con nombre y WhatsApp
2. **Notas con conceptos dinámicos** (agregar/eliminar trabajos con precio)
3. **Toggle de IVA** (16% sobre subtotal cuando requiera factura)
4. **Anticipo inicial** al crear nota
5. **Abonos posteriores** con método de pago (Efectivo/Transferencia)
6. **Ciclo de estados** Pendiente → En Proceso → Pagado → Entregado / Cancelado
7. **Cancelación con retención** matemática por material invertido
8. **Dashboard** con resumen de notas y total por cobrar
9. **Envío por WhatsApp** del resumen de nota
10. **Generación de PDF** del historial de nota

## Lógica Financiera

| Operación           | Fórmula                                         |
| ------------------- | ----------------------------------------------- |
| Subtotal            | `∑ precio de conceptos`                         |
| IVA                 | `requiereFactura ? subtotal * 0.16 : 0`         |
| Total               | `subtotal + iva`                                |
| Saldo inicial       | `total - anticipo`                              |
| Saldo tras abono    | `saldoPendiente - montoAbono`                   |
| Cancelación         | `devolucion = anticipo - costoInversion`        |
| Si devolución < 0   | cliente debe pagar la diferencia                |
