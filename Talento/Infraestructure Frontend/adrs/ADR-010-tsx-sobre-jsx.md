---
title: "ADR-010: .tsx en lugar de .jsx"
status: accepted
date: 2026-06-15
---

# ADR-010: .tsx en lugar de .jsx

## Contexto

El stack del proyecto incluye TypeScript (Inertia + React + TypeScript). Los componentes de React pueden escribirse con extensión `.jsx` (JSX plano sin tipos) o `.tsx` (JSX con TypeScript).

Tener ambas extensiones en el código base genera fricción:

- ¿Cuándo usar `.jsx` vs `.tsx`? No hay regla clara
- Componentes nuevos pueden olvidar agregar tipos si usan `.jsx`
- Code review debe discutir convenciones en lugar de revisar lógica

## Decisión

**Usar exclusivamente `.tsx` para todos los componentes de React. Cero archivos `.jsx` en `resources/js/`.**

El tipo de archivo `.tsx` es obligatorio incluso para componentes sin props (íconos, wrappers, layouts).

### Ejemplo

```tsx
// ✅ Correcto — .tsx con interfaz de props
interface ServerCardProps {
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'unknown';
}

export default function ServerCard({ name, ip, status }: ServerCardProps) {
  return <div>...</div>;
}
```

```tsx
// ✅ Correcto — .tsx aunque no tenga props
export default function Spinner() {
  return <div className="animate-spin" />;
}
```

### Justificación

- TypeScript ya está en el stack — usarlo en componentes no agrega dependencias nuevas
- Vite compila `.tsx` sin configuración adicional (viene incluido en Laravel Vite)
- El tipado de props previene bugs por cambios de interfaz entre componentes padre e hijo
- Convención unívoca: no hay ambigüedad al crear un archivo nuevo
- Facilita refactors automatizados (renombrar props, cambiar firmas)

### Excepciones

No hay excepciones. Archivos de configuración de Node/Vite que no son componentes usan `.js` o `.mjs`.

## Opciones consideradas

| Opción | Veredicto |
|---|---|
| **Solo .tsx** (elegido) | Convención única, tipado obligatorio |
| **.jsx para componentes simples** | Ambigüedad, discusiones en code review, componentes simples terminan con tipos después igual |
| **.jsx sin tipos** | Inconsistente con el stack, pierde las ventajas de TypeScript |

## Consecuencias

- Positivas: tipado estricto en todas las props, state, y event handlers
- Positivas: convención clara, sin ambigüedad ni discusiones
- Positivas: refactors más seguros (el compilador detecta props faltantes)
- Negativas: boilerplate adicional para componentes triviales (interfaces de una línea)
- Negativas: archivos `.jsx` existentes habría que migrarlos (oportunidad para agregar tipos reales)

## Referencias

- [Vite — TypeScript](https://vitejs.dev/guide/features.html#typescript)
- [Laravel Vite](https://laravel.com/docs/11.x/vite)
- ADR-007: Arquitectura del software
