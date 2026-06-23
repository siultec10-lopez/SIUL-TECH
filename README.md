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
