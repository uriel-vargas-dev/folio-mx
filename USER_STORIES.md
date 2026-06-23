# User Stories - Folio MX

Estados de nota: `PENDIENTE` → `EN_PROCESO` → `PAGADA_SIN_ENTREGAR` → `ENTREGADA` → `CANCELADA`

---

## HU-01: Lista de Clientes

**Como** administrador del taller,
**Quiero** ver una lista de todos mis clientes registrados,
**Para** seleccionar uno y ver su detalle o crear una nota para él.

**DoD:**
- Pantalla `app/(tabs)/clients.tsx` con FlatList
- Cada item muestra nombre y saldo pendiente
- Tap navega a `/client/[id]`
- Botón flotante "+" navega a `/client/new`

---

## HU-02: Registrar Cliente Nuevo

**Como** administrador del taller,
**Quiero** registrar un cliente con nombre y WhatsApp,
**Para** no tener que pedir sus datos cada vez.

**DoD:**
- Pantalla `app/client/new.tsx` con formulario
- Validar nombre no vacío y WhatsApp 10 dígitos (Zod)
- Guardar en colección `clientes` de Firestore
- Redirigir a lista de clientes tras éxito

---

## HU-03: Detalle del Cliente con Historial

**Como** administrador del taller,
**Quiero** ver el perfil del cliente con todas sus notas anteriores y su saldo total,
**Para** saber rápidamente si me debe dinero o qué ha traído antes.

**DoD:**
- Pantalla `app/client/[id].tsx`
- Consultar notas filtradas por `id_cliente`
- Mostrar saldo pendiente total destacado
- FlatList con fecha, folio y estado de cada nota
- Botón "Nueva Nota" navega a `/note/new?id_cliente=X`

---

## HU-04: Crear Nota con Conceptos Dinámicos

**Como** administrador del taller,
**Quiero** crear una nota agregando múltiples conceptos de texto libre con precio,
**Para** adaptarme a cualquier pieza que llegue al taller.

**DoD:**
- Pantalla `app/note/new.tsx`
- Input para seleccionar cliente
- Arreglo dinámico de conceptos (descripción + precio)
- Botón "Agregar concepto" añade fila
- Botón "Eliminar" por cada concepto
- Subtotal se calcula en tiempo real

---

## HU-05: Toggle de IVA (16%)

**Como** administrador del taller,
**Quiero** un switch para activar/desactivar IVA en la nota,
**Para** recalcular el total solo cuando el cliente pida factura.

**DoD:**
- Switch en formulario de `app/note/new.tsx`
- Activo → calcular 16% sobre subtotal y sumar al total
- Inactivo → IVA = 0, total = subtotal
- Guardar `requiereFactura` en Firestore

---

## HU-06: Anticipo Inicial

**Como** administrador del taller,
**Quiero** registrar un anticipo al crear la nota,
**Para** cubrir gastos mínimos de arranque.

**DoD:**
- Campo numérico "Anticipo" en `app/note/new.tsx`
- Validar que no sea mayor al total
- Saldo = total - anticipo
- Guardar anticipo como primer abono en arreglo `abonos`

---

## HU-07: Lista de Notas

**Como** administrador del taller,
**Quiero** ver todas las notas del sistema con su estado y saldo,
**Para** tener visibilidad de todos los trabajos activos.

**DoD:**
- Pantalla `app/(tabs)/notes.tsx` con FlatList
- Cada item muestra folio, cliente, estado (con color) y saldo
- Tap navega a `/note/[id]`
- Filtrar por estado (opcional)

---

## HU-08: Detalle de Nota y Gestión de Estados

**Como** administrador del taller,
**Quiero** ver el detalle de una nota y cambiar su estado,
**Para** mantener control visual del avance del trabajo.

**DoD:**
- Pantalla `app/note/[id].tsx`
- Mostrar cliente, conceptos, subtotal, IVA, total, abonos, saldo
- Selector de estados con colores:
  - `PENDIENTE` → rojo
  - `EN_PROCESO` → amarillo
  - `PAGADA_SIN_ENTREGAR` → azul
  - `ENTREGADA` → verde
  - `CANCELADA` → gris
- Actualizar estado en Firestore al cambiar

---

## HU-09: Registrar Abono a Nota Existente

**Como** administrador del taller,
**Quiero** registrar abonos adicionales a una nota con método de pago,
**Para** reducir el saldo pendiente hasta liquidar.

**DoD:**
- Botón "Registrar Abono" en `app/note/[id].tsx`
- Modal con monto y selector de método (Efectivo/Transferencia)
- Usar `arrayUnion` en Firestore para agregar al arreglo `abonos`
- Recalcular saldo: `saldo = total - sum(abonos)`
- Si saldo <= 0, cambiar estado a `PAGADA_SIN_ENTREGAR`

---

## HU-10: Cancelación de Nota con Retención

**Como** administrador del taller,
**Quiero** cancelar una nota indicando el costo de material invertido,
**Para** que el sistema calcule retención y devolución.

**DoD:**
- Botón "Cancelar Nota" solo si estado es `PENDIENTE` o `EN_PROCESO`
- Modal pide "Costo de inversión/material trabajado"
- Fórmula: `devolucion = anticipo - costoInversion`
  - Si devolución > 0: se le devuelve esa cantidad
  - Si devolución < 0: cliente debe pagar la diferencia (retención extra)
- Registrar desglose en la nota
- Cambiar estado a `CANCELADA`

---

## HU-11: Dashboard con Resumen Global

**Como** administrador del taller,
**Quiero** ver en la pantalla de inicio un resumen de notas y dinero por cobrar,
**Para** tener una visión rápida de la salud del taller.

**DoD:**
- Pantalla `app/(tabs)/index.tsx`
- Tarjetas con:
  - Notas pendientes + en proceso
  - Notas terminadas (entregadas)
  - Total por cobrar (saldo de notas no entregadas)
- Botón rápido "Nueva Nota"

---

## HU-12: Enviar Resumen por WhatsApp

**Como** administrador del taller,
**Quiero** enviar un resumen de la nota al cliente por WhatsApp,
**Para** notificarle sin redactar manualmente.

**DoD:**
- Botón "Enviar por WhatsApp" en `app/note/[id].tsx`
- Abrir `wa.me/{numero}` con mensaje preformateado
- Mensaje incluye: folio, conceptos, total, anticipo, saldo, estado
- Número del cliente se toma dinámicamente de su perfil

---

## HU-13: Generar PDF de Nota

**Como** administrador del taller,
**Quiero** generar un PDF con el detalle de la nota,
**Para** imprimirlo o compartirlo digitalmente.

**DoD:**
- Botón "Generar PDF" en `app/note/[id].tsx`
- Usar `expo-print` para generar el PDF
- PDF incluye: encabezado del taller, datos del cliente, conceptos, totales, abonos, saldo
- Compartir o guardar el archivo
