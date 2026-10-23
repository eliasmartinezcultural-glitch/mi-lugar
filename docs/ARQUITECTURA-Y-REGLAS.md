# Mi Lugar — arquitectura y reglas de construcción

## Identidad
Mi Lugar es una casa rural ilustrada, acogedora y explorable en primera persona mediante interacciones con objetos. No es una página de enlaces ni un videojuego competitivo. Su principio rector es el descanso, la curiosidad y el cuidado cotidiano sin presión.

## Base protegida
- La primera escena original se conserva en `docs/BASELINE-ESCENA-1.html`.
- No eliminar ni reemplazar esa copia de seguridad.
- Trabajar sobre los archivos activos y comprobarlos después de cada cambio.
- La escena actual es una ampliación evolutiva, no un reinicio.

## Estructura activa
- `index.html`: estructura de la casa, escenas, controles, cine, música y lectura.
- `css/styles.css`: identidad visual, ilustración adaptable, accesibilidad y animaciones.
- `js/app.js`: navegación, tareas rurales, estado local, reproductores y sonido ambiental.
- `docs/BASELINE-ESCENA-1.html`: copia intacta de la primera escena.

## Escenas
1. Interior: ventana, sillón, estufa, televisor, biblioteca y mesa matera.
2. Patio: huerta, árboles, flores, gallinero y camino a la casa.

## Acciones actuales
- Cambiar entre interior y patio.
- Regar la huerta, plantar semillas y atender el bebedero/alimento de las gallinas como simulaciones interactivas.
- Preparar mates y leer mensajes ambientales.
- Activar un sonido experimental generado en el navegador.
- Cargar URL de un video o lista de YouTube en los reproductores de cine y música.
- Solicitar pantalla completa para el reproductor.
- Guardar el estado básico de las tareas en el almacenamiento local del dispositivo.

## Cine y música: límites importantes
- El reproductor integrado utiliza el reproductor oficial de YouTube; la inserción depende de que el video permita reproducción externa.
- CINE.AR Play es el acceso recomendado para el catálogo de cine argentino: https://play.cine.ar/
- Los botones de búsqueda ayudan a encontrar canales y contenido, pero no garantizan que cada resultado sea oficial o esté disponible en todos los países.
- No alojar películas ni música con derechos de terceros sin permiso.
- La pantalla completa depende de las capacidades del navegador, el dispositivo y los permisos del video insertado.
- La música no comienza automáticamente; el visitante decide cuándo reproducirla.
- Los sonidos de campo actuales son tonos sintéticos de demostración, no grabaciones reales.

## Multidispositivo
- Diseño adaptable para escritorio, tablet y celular.
- Botones táctiles amplios y escenas verticales en pantallas estrechas.
- Se respeta la preferencia del sistema por reducir animaciones.
- No requiere instalación ni cuenta de usuario.
- Los estados guardados con almacenamiento local pertenecen a ese navegador/dispositivo; no se sincronizan entre dispositivos.

## Próximas etapas
1. Animaciones de riego, agua en bebederos, gallinas y crecimiento de plantas con cambios visibles en escena.
2. Catálogo editorial de películas y música con enlaces verificados, títulos, géneros y accesos a plataformas oficiales.
3. Grabaciones ambientales con licencia compatible y controles separados para viento, aves y gallinero.
4. Biblioteca navegable con lecturas breves, favoritos y opción de retomar.
5. Mejoras de perspectiva, accesibilidad y controles para pantallas táctiles y TV.
6. Pruebas en distintos navegadores y tamaños antes de marcar una versión estable.

## Regla de honestidad
No declarar una función lista solo porque exista un botón. Verificar que el botón responda; distinguir las simulaciones digitales de acciones reales; y explicar cuándo una plataforma externa, permisos, conexión o derechos de contenido limitan la reproducción.
