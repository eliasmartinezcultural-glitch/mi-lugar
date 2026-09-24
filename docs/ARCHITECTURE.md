# Arquitectura

**Versión de referencia: 1.4 · CAPA VISUAL CONSOLIDADA**  
**Estado:** arquitectura protegida; no se modifica la estructura pública ni la funcionalidad congelada.

## Capas
### Presentación
HTML semántico + CSS visual + componentes reutilizables.

### Experiencia
Navegación, filtros, búsqueda, rutas, estados y compartir.

### Contenido
Datos territoriales separados de la interfaz.

### Relaciones
IDs y referencias entre entidades.

### Trazabilidad
Fuente, estado de verificación, fecha de revisión y notas editoriales.

## Modelo conceptual

place
- id
- title
- slug
- summary
- category
- location
- image
- tags
- related
- verification

story
- id
- title
- slug
- summary
- body
- period
- people
- places
- media
- sources
- verification

route
- id
- title
- slug
- duration
- difficulty
- stops
- summary

## Reglas técnicas
1. Los datos no deben quedar mezclados con la lógica de interfaz cuando puedan separarse.
2. Los IDs son estables.
3. Los slugs son legibles.
4. Las relaciones usan IDs, no nombres escritos a mano.
5. Los componentes visuales deben tolerar contenido corto y largo.
6. Un error de un contenido no debe inutilizar todo el sitio.
7. La ausencia de contenido se trata semánticamente, no con bloques rotos.
8. Todo cambio estructural importante se documenta antes de ejecutarse.

## Protección 1.4
La arquitectura descrita aquí es la base protegida sobre la que se consolidó la Versión 1.4. Los avances de esta versión se realizan sin alterar el núcleo público congelado.

Estado de referencia y versión vigente: `docs/VERSION-STATUS.md`.
