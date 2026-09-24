# Mi Lugar — Manifiesto de cierre 1.4

**Versión:** 1.4 · CAPA VISUAL CONSOLIDADA  
**Estado:** LISTA / CONGELADA EN ESTRUCTURA Y FUNCIONALIDAD  
**Fecha:** 2026-09-24

## 1. Autoridad de versión

La versión vigente se define exclusivamente en:

`docs/VERSION-STATUS.md`

Este manifiesto complementa ese documento con una fotografía técnica del estado de cierre.

## 2. Núcleo protegido

Estos dos archivos forman el núcleo funcional congelado y no deben modificarse dentro de 1.4:

| Archivo | SHA de referencia |
|---|---|
| `index.html` | `7262012388b222dd711ee1d3a3e96b8e77807f50` |
| `js/app.js` | `8c0a406c86281ed324a7fae8a7b1e9f77151e876` |

Si alguno cambia, el cambio debe considerarse **estructural/funcional** y requiere una nueva revisión de versión o autorización explícita.

## 3. Sistema visual

`css/styles.css` pertenece a la capa visual de 1.4.

Su evolución está permitida siempre que:
- no requiera modificar HTML o JS;
- no rompa navegación;
- no convierta la experiencia en una interfaz recargada;
- conserve mobile first;
- mantenga la jerarquía territorial.

## 4. Contenido

Los datos territoriales son independientes de la versión de aplicación.

Estado de referencia:
- `data/places.json` → dataset 0.5.0
- `data/stories.json` → dataset 0.5.0
- `data/routes.json` → dataset 0.1.0, actualmente reservado

Los números de dataset **no reemplazan ni contradicen** la versión de producto 1.4: describen únicamente la evolución de cada colección de contenido.

## 5. Orden editorial 1.4

1. Territorio y paisaje.
2. Historia y memoria.
3. Personas y comunidad.
4. Cultura y producción local.
5. Actividad comercial, como capa secundaria.

## 6. Criterio visual

La experiencia debe transmitir:
- pueblo real;
- cercanía;
- paisaje;
- memoria;
- fotografía;
- papel/archivo;
- ilustración editorial;
- cuidado del lugar.

Debe evitar:
- estética corporativa;
- portal institucional;
- catálogo turístico genérico;
- videojuego;
- exceso de tarjetas;
- decoración sin significado.

## 7. Criterio de verdad

No se publican como hechos:
- datos no verificados;
- horarios o precios no comprobados;
- testimonios inventados;
- recomendaciones atribuidas a vecinos sin fuente;
- actividades o servicios inexistentes.

Frases como “te lo mostraría al atardecer” son tratamiento editorial, no testimonios.

## 8. Mapa

El mapa de 1.4 es una pieza **visual/editorial**, no una nueva funcionalidad interactiva.

No debe transformarse en un sistema de navegación externo dentro de esta versión.

## 9. Cuidado del territorio

La comunicación puede incorporar, de forma breve y no moralizante:
- saludá;
- llevate tu basura;
- respetá el paisaje;
- respetá a quienes viven en el lugar;
- dejá el lugar como lo encontraste.

## 10. Regla de avance

Mientras 1.4 permanezca vigente, avanzar significa **refinar**, no expandir.

La próxima tarea válida puede mejorar:
- fotografías;
- ilustraciones;
- composición;
- tipografía;
- color;
- textura;
- contenido;
- trazabilidad;
- responsive;
- coherencia entre piezas.

No se agregan funciones solo para que el proyecto parezca más grande.

## 11. Cierre

**Mi Lugar 1.4 está listo como base de trabajo visual y editorial.**

El proyecto puede continuar creciendo sin volver a discutir su arquitectura en cada paso.

> **Simple para quien llega. Profundo para quien quiere quedarse.**
