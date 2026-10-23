# MI LUGAR 004 — MEDIOS DENTRO DE LA CASA

## Objetivo
Eliminar el comportamiento que expulsaba a la persona a búsquedas de YouTube o plataformas externas al tocar opciones del televisor o del equipo de música.

## Cambios implementados en esta rama
- Se eliminaron las llamadas `window.open(...)` del flujo de cine y música.
- Las categorías del televisor ahora permanecen dentro del panel y piden un enlace compatible en el reproductor integrado; no abren búsquedas externas.
- El panel de música ofrece cuatro melodías generadas en el propio navegador con Web Audio: melodía matera, viento en el patio, fogón y noche patagónica. Incluye control para detenerlas.
- Se enriquecieron los estados visuales del panel y la atmósfera de la escena con movimiento ambiental, respuesta visual tras regar la huerta y atender a las gallinas.
- Se mantiene la escena principal, los objetos, la navegación y la rama fundacional protegida.

## Límites que deben decirse con claridad
- Las melodías incorporadas son composiciones sintéticas simples generadas en el navegador; **no son canciones comerciales ni grabaciones reales de instrumentos o naturaleza**.
- El reproductor de video integrado reproduce videos o listas compatibles cuando se pega su enlace. Esta etapa todavía no crea un catálogo automático de películas ni una búsqueda interna real: eso requiere una fuente de catálogo autorizada y un método de reproducción que admita inserción.
- YouTube y otros proveedores pueden impedir la reproducción incrustada para ciertas piezas, restricciones de edad o políticas de la cuenta. No se intenta eludir esas restricciones.
- La sintaxis de JavaScript y la ausencia de redirecciones fueron verificadas estáticamente. Falta una prueba visual en navegador real y comprobar reproducción con enlaces específicos.

## Criterios de aceptación
1. Tocar las categorías no abre otra pestaña.
2. La música generada se escucha dentro de la página y se puede detener desde el panel.
3. El enlace de video compatible se reproduce en el marco integrado.
4. No se agrega contenido debajo del mundo ni se modifica la estructura fundacional.
