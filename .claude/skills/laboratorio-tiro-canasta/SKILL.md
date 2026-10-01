---
name: laboratorio-tiro-canasta
description: >
  Asistente especializado para desarrollar y mantener el laboratorio virtual
  interactivo del proyecto de investigación sobre el tiro a canasta. Utilizar
  cuando se diseñen, implementen, modifiquen, depuren o revisen funcionalidades
  relacionadas con el modelo físico, geométrico, biomecánico, Dibujo Técnico,
  simulación, análisis de eficacia, márgenes de error o interfaz del laboratorio.
---

# Skill: Laboratorio virtual de tiro a canasta

## 1. Propósito del proyecto

El proyecto desarrolla un laboratorio virtual interactivo para estudiar el tiro
a canasta integrando:

- modelo físico;
- modelo geométrico;
- Dibujo Técnico;
- biomecánica simplificada;
- herramientas de Inteligencia Artificial.

El laboratorio debe servir para visualizar, simular, analizar y comprender los
factores que influyen en la eficacia del lanzamiento.

El modelo físico, geométrico y metodológico constituye el núcleo del proyecto.
La tecnología debe utilizarse para materializar estos modelos, no para sustituir
las decisiones científicas del proyecto.

## 2. Objetivo general

Desarrollar una experiencia interactiva de simulación del tiro en baloncesto que
integre modelos físicos, geométricos, biomecánicos y conceptos de Inteligencia
Artificial para visualizar y comprender los factores que determinan la eficacia
del lanzamiento.

## 3. Principios de desarrollo

### 3.1 El modelo antes que la interfaz

No modificar las ecuaciones, variables o criterios científicos simplemente para
hacer más sencilla la programación o más atractiva la interfaz.

Si una decisión técnica entra en conflicto con el modelo físico o geométrico,
se debe señalar el conflicto antes de implementar el cambio.

### 3.2 Separación entre ciencia y presentación

Mantener separadas, siempre que sea posible:

- lógica matemática;
- lógica geométrica;
- lógica de simulación;
- componentes visuales;
- presentación de resultados.

La interfaz debe representar los resultados del modelo, no alterar el modelo.

### 3.3 Trazabilidad

Toda funcionalidad importante debe poder relacionarse con:

REQUISITO → MODELO → ESPECIFICACIÓN → IMPLEMENTACIÓN → PRUEBA

Cuando se añada una funcionalidad nueva, identificar qué requisito o necesidad
del proyecto justifica su existencia.

### 3.4 Verificación

No considerar correcto un resultado únicamente porque el código se haya
generado mediante Inteligencia Artificial.

Los cálculos implementados deben contrastarse con el modelo matemático definido
en el proyecto y con casos de prueba conocidos.

## 4. Variables principales del modelo físico

Las variables de entrada principales son:

- V₀: velocidad inicial del balón.
- θ: ángulo de lanzamiento.
- y₀: altura de liberación.
- d: distancia horizontal al aro.
- g: aceleración de la gravedad, considerada constante en el modelo.

El modelo utiliza el movimiento parabólico como aproximación del lanzamiento.

La velocidad inicial se descompone en:

Vx = V₀ cos(θ)

Vy = V₀ sen(θ)

La evolución del lanzamiento se basa en:

x(t) = x₀ + V₀ cos(θ)t

y(t) = y₀ + V₀ sen(θ)t - 1/2 gt²

Estas ecuaciones constituyen la referencia matemática que debe reproducir el
simulador.

## 5. Parámetros derivados

El simulador puede obtener, entre otros, parámetros derivados como:

- tiempo de vuelo;
- alcance;
- altura máxima;
- velocidad;
- ángulo de entrada;
- altura del balón al llegar al plano del aro;
- condición de enceste.

No inventar fórmulas nuevas para estos parámetros. Si una fórmula no está
definida en el proyecto, señalarlo y proponer su definición antes de implementarla.

## 6. Condición de enceste

El laboratorio debe diferenciar entre:

1. trayectoria que alcanza el plano del aro;
2. altura compatible con la altura del aro;
3. posición geométricamente compatible con el paso por el aro;
4. resultado final de la simulación.

El modelo geométrico utiliza el balón y el aro como elementos geométricos y
considera especialmente sus posiciones relativas y situaciones límite.

En las construcciones de Dibujo Técnico pueden utilizarse:

- centros;
- radios;
- circunferencias;
- línea de centros;
- puntos de tangencia;
- tangencia interior o exterior cuando corresponda geométricamente.

No etiquetar una construcción como tangencia interior/exterior sin comprobar
previamente que la relación geométrica sea correcta.

## 7. Modelo geométrico

El modelo debe mantener la relación entre:

- jugador;
- balón;
- aro;
- trayectoria;
- sistema de coordenadas.

La ventana geométrica de enceste representa una región de posiciones en la que
el balón puede atravesar el aro de acuerdo con las simplificaciones adoptadas.

La representación geométrica debe ser coherente con los resultados del modelo
físico.

## 8. Dibujo Técnico

Las representaciones desarrolladas en el proyecto incluyen:

- alzado;
- planta;
- perfil;
- construcción geométrica de la trayectoria;
- construcciones de circunferencias y tangencias aplicadas al balón y al aro;
- representación tridimensional/isométrica.

Cuando se genere una representación técnica:

- mantener correspondencia entre vistas;
- utilizar líneas de proyección cuando sean necesarias;
- distinguir líneas principales y auxiliares;
- evitar añadir elementos decorativos que no tengan función técnica;
- priorizar construcciones que demuestren contenidos realmente trabajados.

## 9. Biomecánica

La biomecánica se representa de forma simplificada y sirve para relacionar el
gesto de lanzamiento con las variables del modelo.

No presentar el modelo físico ideal como una reproducción completa del gesto
humano real.

Recordar que el proyecto reconoce limitaciones relacionadas con factores como
la variabilidad del jugador y la complejidad biomecánica del lanzamiento.

## 10. Inteligencia Artificial

La Inteligencia Artificial forma parte de la metodología de desarrollo.

Claude Code se utiliza como asistente de programación para:

- implementar funcionalidades;
- modificar código;
- estructurar componentes;
- detectar y corregir errores;
- iterar sobre el desarrollo.

El desarrollador mantiene el control sobre:

- requisitos;
- modelo físico;
- modelo geométrico;
- variables;
- lógica de la simulación;
- criterios de validación;
- decisiones de diseño.

La IA debe actuar como asistente y no como autoridad científica.

## 11. Uso de prompts

Cuando se trabaje mediante prompts:

1. identificar claramente el objetivo;
2. proporcionar el contexto necesario;
3. indicar restricciones relevantes;
4. solicitar una implementación concreta;
5. probar el resultado;
6. detectar errores o mejoras;
7. realizar una nueva iteración.

No asumir que el primer resultado es definitivo.

Cuando sea útil, documentar la evolución:

PROMPT → IMPLEMENTACIÓN → PRUEBA → PROBLEMA → NUEVO PROMPT → CORRECCIÓN

## 12. Otras herramientas de IA

El proyecto puede utilizar otras herramientas de Inteligencia Artificial además
de Claude Code.

Cada herramienta debe tener una función concreta y justificable dentro del
proceso. No introducir una herramienta únicamente por añadir tecnología.

Registrar para cada herramienta:

- nombre;
- función;
- fase del proyecto;
- resultado obtenido;
- relación con el producto final.

## 13. Diseño de la interfaz

La interfaz debe ser:

- clara;
- visual;
- intuitiva;
- coherente entre módulos;
- adecuada para una experiencia educativa interactiva.

Las decisiones visuales deben facilitar la comprensión de la física y la
geometría, no ocultarlas.

Cuando exista una representación gráfica importante, priorizar que el usuario
pueda identificar fácilmente:

- variables;
- trayectoria;
- aro;
- balón;
- parámetros;
- resultado.

## 14. Arquitectura funcional

Respetar la estructura conceptual definida previamente:

Inicio
→ introducción
→ variables
→ simulación
→ visualización
→ análisis
→ resultados

No rediseñar toda la arquitectura ante una modificación puntual.

Antes de realizar cambios estructurales importantes, explicar qué requisito
los justifica y qué partes del proyecto podrían verse afectadas.

## 15. Reglas de código

- Priorizar código claro y mantenible.
- Evitar duplicación innecesaria.
- Mantener componentes reutilizables.
- No modificar funcionalidades no relacionadas con la tarea solicitada.
- Antes de realizar cambios grandes, inspeccionar la estructura existente.
- Después de modificar una funcionalidad, comprobar que las anteriores siguen
  funcionando.
- No eliminar lógica científica sin justificarlo.

## 16. Reglas de respuesta de la IA

Cuando se solicite una modificación:

1. resumir brevemente qué se va a cambiar;
2. identificar los archivos/componentes afectados;
3. comprobar el contexto existente;
4. implementar el cambio;
5. verificar el resultado;
6. indicar cualquier supuesto realizado.

Si falta información necesaria, no inventarla. Señalar qué dato falta.

Si se detecta una contradicción entre una petición y el modelo científico del
proyecto, señalarla antes de implementarla.

## 17. Criterio de calidad

Una funcionalidad se considera terminada cuando:

- cumple el requisito correspondiente;
- respeta el modelo físico/geométrico;
- funciona correctamente;
- presenta los resultados de forma comprensible;
- no rompe funcionalidades existentes;
- ha sido comprobada mediante al menos un caso de prueba.

## 18. Contexto de investigación

El laboratorio debe permitir estudiar especialmente:

- influencia de la velocidad inicial;
- influencia del ángulo de lanzamiento;
- influencia de la altura de liberación;
- influencia de la distancia al aro;
- trayectoria;
- parámetros derivados;
- eficacia;
- márgenes de error;
- relación entre las representaciones física, geométrica y técnica.

La aplicación final debe servir como herramienta para obtener resultados que
posteriormente puedan analizarse y compararse con el marco teórico y la
bibliografía del proyecto.
