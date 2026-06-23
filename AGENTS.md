# Folio MX - Reglas para IA

## Stack

- React Native + Expo 54
- expo-router (file-based routing en `app/`)
- Zustand (estado global)
- Firebase / Cloud Firestore
- Zod (validación)
- expo-print (PDF)
- WhatsApp via Linking API (wa.me)

## Arquitectura

```
Screens (app/) → Hooks (src/hooks/) → API (src/api/) → Firestore
                    ↓
              Stores Zustand (src/stores/)
```

### Capas

| Carpeta  | Regla |
|----------|-------|
| `src/types/` | Interfaces TS (Client, Note, WorkConcept, Payment) |
| `src/config/` | Solo inicialización Firebase |
| `src/api/` | Única capa que importa Firebase. Funciones async puras |
| `src/hooks/` | Lógica de negocio. Usan api + stores |
| `src/stores/` | Solo estado Zustand, sin lógica |
| `app/` | Screens. Solo Layout + importan hooks |
| `src/components/common/` | Componentes visuales sin lógica |
| `src/components/forms/` | Formularios reutilizables |
| `src/utils/` | Funciones puras (formateo, fechas, folio) |

### Estados de Nota (único modelo)

```
PENDIENTE → EN_PROCESO → PAGADA_SIN_ENTREGAR → ENTREGADA
    ↓            ↓               ↓
    └────────────┴───────────────┴──→ CANCELADA
```

## Convenciones

- Nombres de archivos en camelCase
- Nombres de rutas en kebab-case
- Usar `@/` para imports absolutos
- Zod para validación de formularios
- Las screens NO tienen lógica de negocio, solo llaman hooks
- Los hooks NO llaman Firestore directamente, solo llaman api/
- Las funciones api/ NO manejan estado, solo devuelven datos

## Firebase (pendiente de configurar)

Variables de entorno (EXPO_PUBLIC_FIREBASE_*):
- apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId

## Orden de implementación sugerido

1. Firebase config + types
2. API services (client + note)
3. Stores Zustand
4. Hooks
5. Screens en app/
6. Componentes comunes
7. PDF + WhatsApp

Para más detalle, ver README.md
