---
name: bitacora
description: Añade una entrada a la bitácora de decisiones de IA del proyecto (docs/bitacora-ia.md), registrando una decisión de diseño o técnica tomada con ayuda de Claude durante el desarrollo del Laboratorio Tiro a Canasta. Usa este skill cuando el usuario escriba /bitacora, o cuando pida explícitamente "registra esto en la bitácora", "anota esta decisión en la bitácora de IA" o "documenta esto para la memoria" justo después de tomar una decisión de arquitectura, elegir entre alternativas técnicas (librería, algoritmo, estructura de datos, enfoque de modelado) o resolver un problema de diseño no trivial. No uses este skill para cambios triviales (arreglar un typo, formatear código) ni para decisiones que el usuario no ha tomado todavía.
---

# Bitácora de decisiones de IA

Este proyecto es un trabajo de investigación de Bachillerato. Parte de su metodología consiste en documentar cómo se usa la IA como herramienta de desarrollo: cada decisión de diseño o técnica relevante debe quedar registrada, con su contexto y justificación, en `docs/bitacora-ia.md`. Esa bitácora es evidencia para la memoria del proyecto, así que la calidad de la entrada importa más que la velocidad.

## Cómo generar la entrada

1. **Identifica la decisión a registrar.** Usa el argumento pasado a `/bitacora` si existe; si no, mira los últimos mensajes de la conversación para encontrar la decisión de diseño/técnica que se acaba de tomar (p. ej. elegir una librería, definir una estructura de datos, resolver un problema de modelado).

   Si no hay una decisión clara y concreta que registrar —el argumento es vago o la conversación no contiene una decisión reciente identificable—, no inventes contenido: pregunta al usuario qué decisión quiere documentar y espera su respuesta.

2. **Redacta la entrada en español**, siguiendo exactamente este formato (coincide con la plantilla ya presente en `docs/bitacora-ia.md`):

   ```
   ## [YYYY-MM-DD] Título breve de la decisión

   **Contexto**: qué problema o pregunta motivó la decisión.

   **Alternativas consideradas**: opciones evaluadas (aunque sea brevemente).

   **Decisión**: qué se decidió.

   **Justificación**: por qué, con qué criterios o limitaciones.
   ```

   - Usa la fecha de hoy en formato `YYYY-MM-DD`.
   - El título debe ser breve y descriptivo (4-8 palabras), no una frase genérica como "Decisión técnica".
   - Cada campo debe ser concreto y basarse en lo que realmente se discutió — no rellenes con generalidades si no hay información suficiente; en ese caso pregunta en vez de inventar.

3. **Inserta la entrada en `docs/bitacora-ia.md`.** Las entradas se ordenan de más reciente a más antigua: coloca la nueva entrada justo después del bloque de plantilla/formato inicial del archivo (y antes de la primera entrada existente, si ya hay alguna). No crees archivos nuevos ni toques `CLAUDE.md` ni ningún otro archivo — esta acción se limita a editar `docs/bitacora-ia.md`.

4. **Confirma brevemente al usuario** qué entrada se añadió (puedes mostrar el título y la fecha), para que pueda corregirla si algo no refleja bien la decisión real.
