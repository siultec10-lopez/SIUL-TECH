# SIULTECH

Aplicacion interactiva web para simular el armado de una computadora gamer. El usuario puede filtrar componentes de AMD, INTEL, CORSAIR, MSI, GIGABYTE, ASUS, PATRIOT, SAMSUNG y THERMALTAKE, ver imagenes de cada categoria, agregar piezas y monitores gaming a una build, guardar el armado, limpiar la seleccion y finalizar la configuracion validando compatibilidad.

## Consignas cubiertas

- Manipulacion del DOM con `querySelector`, `createElement`, `innerHTML` y actualizacion dinamica de contenido.
- Eventos con `addEventListener` en botones de agregar, eliminar, guardar, limpiar, finalizar y filtro por categoria.
- Datos externos en `data/componentes.json`, cargados mediante `fetch`.
- Libreria externa: SweetAlert2 desde CDN para mostrar mensajes al usuario.
- Los mensajes del usuario se muestran con SweetAlert2, sin cuadros nativos del navegador.
- Codigo separado en HTML, CSS y JavaScript.
- Logica de aplicacion completa: seleccion de piezas, carrito con cantidades, total, consumo estimado, persistencia y validacion final.
- Bloqueo preventivo de procesadores, placas madre y RAM incompatibles.
- Imagenes locales para los componentes, sin depender de enlaces externos.
- Disipadores liquidos de 360 mm y monitores gaming opcionales de 27 a 34 pulgadas.
- Resumen tipo carrito con cantidades, subtotales por producto y total general.

## Como ejecutar el proyecto

Como la aplicacion carga datos con `fetch`, conviene ejecutarla con un servidor local.

Opcion recomendada:

```bash
node server.js
```

Despues abrir:

```text
http://localhost:5500
```

Tambien puede ejecutarse con Live Server de VS Code o publicarse en GitHub Pages.

## Estructura

```text
.
|-- index.html
|-- server.js
|-- assets/
|   `-- img/
|       `-- componentes/
|-- css/
|   `-- styles.css
|-- data/
|   `-- componentes.json
|-- js/
    `-- app.js
```

## Contexto del proyecto

SIULTECH ayuda a organizar el proceso de elegir componentes para una computadora gamer. La aplicacion permite agregar varias opciones de una misma categoria, calcula subtotales y total general, estima consumo y revisa compatibilidad de socket entre procesador y placa madre, ademas del tipo de RAM soportado por la placa madre. Tambien permite agregar un monitor gaming opcional al presupuesto.

## Reflexion final sugerida

Este proyecto me permitio aplicar JavaScript en una experiencia interactiva real. Practique manipulacion del DOM, eventos, consumo de datos externos con `fetch`, uso de `localStorage`, validaciones de compatibilidad y mensajes visuales con una libreria externa. Tambien aprendi la importancia de ordenar el codigo y documentar el proyecto para que pueda ser revisado con claridad.
