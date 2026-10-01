# Laboratorio Tiro a Canasta

Instrucciones de proyecto para Claude Code. Léelas antes de proponer o implementar nada.

## Qué es este proyecto

Trabajo de investigación de Bachillerato (título provisional): **«Simulación y análisis del tiro a canasta en baloncesto mediante modelos físicos, geométricos e inteligencia artificial»**.

El entregable técnico es una aplicación web interactiva que sirve de laboratorio virtual para el tiro a canasta, combinando tres enfoques de análisis:

1. **Modelo físico** — trayectoria de la pelota mediante ecuaciones de movimiento (tiro parabólico, con posible extensión a resistencia del aire / efecto Magnus).
2. **Modelo geométrico** — condiciones de entrada en el aro (ángulos, ventana efectiva de encesto, sensibilidad a la posición).
3. **Inteligencia artificial** — ver más abajo; su función concreta dentro de la app está pendiente de decidir.

## Estado actual

**Fase de configuración inicial.** Todavía no existe código de la aplicación ni estructura de carpetas del proyecto software. No crear la subcarpeta de la app ni implementar funcionalidades hasta que el usuario lo pida explícitamente — primero se planifica la arquitectura con él.

## El papel de la IA en este proyecto (importante, no es decorativo)

Hay dos funciones de IA claramente distintas y **no deben confundirse**:

1. **IA como herramienta de desarrollo.** Claude se usa para programar, generar código, analizar problemas de diseño y mejorar la aplicación de forma iterativa. Este proceso debe quedar documentado: cada decisión de diseño o técnica relevante (elección de arquitectura, librería, algoritmo, solución a un problema de diseño no trivial) se registra en `docs/bitacora-ia.md` — usa el skill `/bitacora` para añadir una entrada. Esto es parte del propio trabajo de investigación (metodología), no un extra opcional.

2. **IA como posible función dentro de la aplicación.** Se estudiará si tiene sentido incorporar una función de IA que aporte valor real al simulador (analizar configuraciones de lanzamiento, encontrar patrones, comparar resultados, sugerir condiciones favorables). **No implementar una función de IA ficticia o decorativa.** Esta función solo se aborda después de construir y validar correctamente los modelos físico y geométrico, y solo si los datos/resultados reales del proyecto lo justifican. La IA complementa el modelo matemático, no lo sustituye.

## Convenciones

- **Idioma**: documentación, comentarios explicativos y la memoria del proyecto en **español**. Identificadores de código (variables, funciones, componentes, nombres de archivo de código) en **inglés**, siguiendo la práctica estándar de programación.
- **Stack técnico**: **React + TypeScript** para la aplicación web, con **Vite** como herramienta de build y entorno de desarrollo (decisión ya tomada). Vite se eligió frente a Next.js (innecesario: no hay SSR ni backend propio por ahora) y Create React App (en desuso). HTML/CSS se usan dentro del ecosistema de componentes de React; toda la lógica en JavaScript/TypeScript.
- **Arquitectura modular**: la aplicación se organiza en módulos independientes y componentes reutilizables — al menos: simulación física, cálculos matemáticos, visualización de trayectorias, análisis geométrico, gráficas/resultados, y un módulo de IA a futuro. Cada módulo debe poder evolucionar sin acoplarse innecesariamente a los demás. La estructura de carpetas concreta que materializa esto todavía está pendiente de definir (ver "Próximos pasos").
- **Control de versiones**: git local únicamente por ahora, sin remoto configurado. No añadir un remoto ni hacer push sin que el usuario lo pida.
- **Sin abstracciones prematuras**: no crear estructura, dependencias ni funcionalidades "por si acaso". Cada pieza de la app debe poder justificarse por un objetivo concreto del trabajo de investigación.

## Bitácora de decisiones de IA

Archivo: [`docs/bitacora-ia.md`](docs/bitacora-ia.md).

Registra ahí cualquier decisión de diseño o técnica no trivial tomada con ayuda de Claude: el contexto/problema, las alternativas consideradas, la decisión final y la justificación. Usa el skill `/bitacora` para generar la entrada con el formato correcto. Esto documenta el proceso de "IA como herramienta de desarrollo" para la memoria del trabajo de investigación.

## Próximos pasos (no ejecutar todavía, solo referencia)

1. Planificar la arquitectura de la aplicación con el usuario (estructura de carpetas, modelos de datos, librerías de física/gráficos, cómo se relacionan modelo físico / geométrico / IA en la interfaz).
2. Definir la estructura de carpetas del código (p. ej. `app/` para el proyecto Vite + React + TS, organizado por módulos) solo cuando la arquitectura esté acordada. No ejecutar `npm create vite` ni instalar dependencias hasta ese momento.
3. Implementar de forma incremental, empezando por el modelo físico como base.
