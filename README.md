# Folio MX - Sistema de Gestión de Taller

Sistema móvil desarrollado para digitalizar y optimizar la gestión de notas, anticipos y entregas de un taller especializado en pulido y cromado de piezas.

El proyecto resuelve la necesidad de manejar conceptos de trabajo totalmente dinámicos, control de abonos asíncronos y generación de recibos digitales.

## Stack Tecnológico

- **Frontend:** React Native + Expo
- **Gestor de Estado Global:** Zustand
- **Base de Datos (BaaS):** Firebase (Cloud Firestore)
- **Generación de Documentos:** `expo-print` (Exportación a PDF)
- **Integración:** Envío de comprobantes a través de la API de WhatsApp

## Características Principales (MVP)

- **Manejo Dinámico de Conceptos:** Creación de notas con múltiples trabajos de texto libre, adaptándose a la recepción de piezas variadas.
- **Control Financiero y Abonos:** Sistema de registro de anticipos iniciales, abonos posteriores y cálculo automático de saldos pendientes.
- **Manejo de Impuestos:** Aplicación condicional del 16% de IVA sobre el subtotal exclusivo para trabajos que requieren facturación.
- **Sistema de Cancelaciones y Retenciones:** Lógica matemática para calcular retenciones por material invertido y devoluciones al cliente tras abortar un trabajo.
- **Estados de Ciclo de Vida:** Control estricto de notas bajo los estados `PENDIENTE`, `PAGADA_SIN_ENTREGAR`, `ENTREGADA` y `CANCELADA`.
- **Generación de PDF:** Exportación del historial de la nota y envío directo al cliente.

## Arquitectura de Datos (Firestore)

El modelo de datos utiliza un enfoque NoSQL estructurado para optimizar la lectura de perfiles financieros:

- **Colección `clientes`**: Almacena datos de contacto y un acumulado desnormalizado de adeudos globales.
- **Colección `notas`**: Núcleo del sistema. Almacena arreglos de conceptos, el historial de abonos y referencias al cliente, evitando subcolecciones profundas para reducir el costo de lectura.

## Instalación y Entorno de Desarrollo local

1. Clonar el repositorio:

```bash
git clone [https://github.com/uriel-vargas-dev/folio-mx.git](https://github.com/uriel-vargas-dev/folio-mx.git)
```
