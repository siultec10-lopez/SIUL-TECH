// El catalogo se llena con los datos que vienen del archivo JSON.
let componentes = [];

// Recupero el armado guardado para que no se pierda al recargar la pagina.
let pcArmada = normalizarCarrito(JSON.parse(localStorage.getItem("pcArmada")) || []);

// Elementos principales del HTML que voy a modificar desde JavaScript.
const contenedorComponentes = document.querySelector("#contenedorComponentes");
const filtroCategoria = document.querySelector("#filtroCategoria");
const resumenPc = document.querySelector("#resumenPc");
const totalHTML = document.querySelector("#total");
const consumoTotalHTML = document.querySelector("#consumoTotal");

const btnGuardar = document.querySelector("#btnGuardar");
const btnLimpiar = document.querySelector("#btnLimpiar");
const btnFinalizar = document.querySelector("#btnFinalizar");

// Nombres que muestro en la interfaz y si la categoria es obligatoria.
const categorias = {
  procesador: { nombre: "Procesador", requerida: true },
  motherboard: { nombre: "Placa madre", requerida: true },
  ram: { nombre: "RAM", requerida: true },
  gpu: { nombre: "Tarjeta gráfica", requerida: true },
  almacenamiento: { nombre: "Almacenamiento", requerida: true },
  fuente: { nombre: "Fuente", requerida: true },
  gabinete: { nombre: "Case", requerida: true },
  refrigeracion: { nombre: "Disipador líquido", requerida: true },
  monitor: { nombre: "Monitor", requerida: false },
};

// Cargo los componentes desde un JSON externo usando fetch.
fetch("./data/componentes.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("No se pudo cargar el archivo de componentes.");
    }

    return response.json();
  })
  .then((data) => {
    componentes = data;
    actualizarCatalogo();
    mostrarResumen();
  })
  .catch(() => {
    contenedorComponentes.innerHTML = `
      <p class="estado-carga">
        No se pudieron cargar los componentes. Abri el proyecto con
        <strong>node server.js</strong> y entra a <strong>http://localhost:5500</strong>.
      </p>
    `;
    mostrarResumen();
  });

// Dibuja las tarjetas del catalogo segun el filtro elegido.
function mostrarComponentes(listaComponentes) {
  contenedorComponentes.innerHTML = "";

  listaComponentes.forEach((componente) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const itemEnCarrito = buscarItemCarrito(componente.id);
    const problemasParaAgregar = obtenerProblemasParaAgregar(componente);
    const estaBloqueado = problemasParaAgregar.length > 0;

    if (estaBloqueado) {
      card.classList.add("card-bloqueada");
    }

    card.innerHTML = `
      <img
        class="card-imagen"
        src="${componente.imagen}"
        alt="${componente.nombre}"
        loading="lazy"
      />
      <div class="card-contenido">
        <div class="card-etiquetas">
          <span class="marca">${componente.marca || "Gaming"}</span>
          <span class="badge">${componente.destacado || "Setup"}</span>
        </div>
        <h3>${componente.nombre}</h3>
        <p class="categoria">${formatearCategoria(componente.categoria)}</p>
        <ul class="specs">
          ${obtenerSpecsHTML(componente)}
        </ul>
        ${estaBloqueado ? `<p class="compatibilidad">${problemasParaAgregar[0]}</p>` : ""}
        <div class="card-footer">
          <p class="precio">L ${formatearPrecio(componente.precio)}</p>
          <button class="btnAgregar" data-id="${componente.id}" ${estaBloqueado ? "disabled" : ""}>
            ${estaBloqueado ? "No compatible" : itemEnCarrito ? "Sumar" : "Agregar"}
          </button>
        </div>
      </div>
    `;

    contenedorComponentes.appendChild(card);
  });

  agregarEventosBotones();
}

// Refresca el catalogo cuando cambia el filtro o el armado.
function actualizarCatalogo() {
  mostrarComponentes(obtenerComponentesFiltrados());
}

// Devuelve todos los productos o solo los de la categoria seleccionada.
function obtenerComponentesFiltrados() {
  const categoriaSeleccionada = filtroCategoria.value;

  if (categoriaSeleccionada === "todos") {
    return componentes;
  }

  return componentes.filter((componente) => {
    return componente.categoria === categoriaSeleccionada;
  });
}

// Asigna el evento click a los botones de las tarjetas.
function agregarEventosBotones() {
  const botonesAgregar = document.querySelectorAll(".btnAgregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.id);
      agregarComponente(id);
    });
  });
}

// Agrega un producto nuevo o suma cantidad si ya estaba en el armado.
function agregarComponente(id) {
  const componenteEncontrado = componentes.find((item) => item.id === id);
  const problemasParaAgregar = obtenerProblemasParaAgregar(componenteEncontrado);

  if (problemasParaAgregar.length > 0) {
    mostrarMensaje({
      icon: "error",
      title: "No compatible",
      html: problemasParaAgregar.map((problema) => `<p>${problema}</p>`).join(""),
    });
    return;
  }

  const itemEnCarrito = buscarItemCarrito(id);

  if (itemEnCarrito) {
    aumentarCantidad(id, true);
    return;
  }

  pcArmada.push({ ...componenteEncontrado, cantidad: 1 });
  mostrarResumen();
  actualizarCatalogo();

  mostrarMensaje({
    icon: "success",
    title: "Agregado",
    text: `${componenteEncontrado.nombre} ahora tiene 1 unidad.`,
  });
}

// Muestra el resumen como carrito, con cantidad y subtotal por producto.
function mostrarResumen() {
  resumenPc.innerHTML = "";

  pcArmada.forEach((componente) => {
    const item = document.createElement("div");
    item.classList.add("item-resumen");

    item.innerHTML = `
      <div class="detalle-item">
        <strong>${componente.nombre}</strong>
        <span class="categoria-resumen">${formatearCategoria(componente.categoria)}</span>
        <span>${componente.marca || formatearCategoria(componente.categoria)} - L ${formatearPrecio(componente.precio)} c/u</span>
        <span>Subtotal: L ${formatearPrecio(componente.precio * componente.cantidad)}</span>
      </div>
      <div class="acciones-item">
        <div class="controles-cantidad">
          <button class="btnRestarCantidad" data-id="${componente.id}" ${componente.cantidad <= 1 ? "disabled" : ""}>-</button>
          <span>${componente.cantidad}</span>
          <button class="btnSumarCantidad" data-id="${componente.id}">+</button>
        </div>
        <button class="btnEliminar" data-id="${componente.id}">
          Eliminar
        </button>
      </div>
    `;

    resumenPc.appendChild(item);
  });

  calcularTotal();
  agregarEventosResumen();
}

// Actualiza el total general y el consumo estimado.
function calcularTotal() {
  totalHTML.textContent = formatearPrecio(calcularTotalNumero());
  consumoTotalHTML.textContent = calcularConsumoEstimado();
}

// Eventos de los botones que aparecen dentro del resumen.
function agregarEventosResumen() {
  const botonesEliminar = document.querySelectorAll(".btnEliminar");
  const botonesSumar = document.querySelectorAll(".btnSumarCantidad");
  const botonesRestar = document.querySelectorAll(".btnRestarCantidad");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.id);
      eliminarComponente(id);
    });
  });

  botonesSumar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.id);
      aumentarCantidad(id);
    });
  });

  botonesRestar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.id);
      disminuirCantidad(id);
    });
  });
}

// Quita por completo un producto del armado.
function eliminarComponente(id) {
  pcArmada = pcArmada.filter((componente) => componente.id !== id);
  mostrarResumen();
  actualizarCatalogo();
}

// Suma una unidad y revisa compatibilidad antes de aplicar el cambio.
function aumentarCantidad(id, mostrarConfirmacion = false) {
  const item = buscarItemCarrito(id);

  if (!item) {
    return false;
  }

  const nuevaCantidad = item.cantidad + 1;
  const problemas = obtenerProblemasParaCantidad(id, nuevaCantidad);

  if (problemas.length > 0) {
    mostrarMensaje({
      icon: "error",
      title: "Cantidad no compatible",
      html: problemas.map((problema) => `<p>${problema}</p>`).join(""),
    });
    return false;
  }

  item.cantidad = nuevaCantidad;
  mostrarResumen();
  actualizarCatalogo();

  if (mostrarConfirmacion) {
    mostrarMensaje({
      icon: "success",
      title: "Cantidad actualizada",
      text: `${item.nombre} ahora tiene ${item.cantidad} unidad(es).`,
    });
  }

  return true;
}

// Resta una unidad sin permitir cantidades menores a 1.
function disminuirCantidad(id) {
  const item = buscarItemCarrito(id);

  if (!item || item.cantidad <= 1) {
    return;
  }

  item.cantidad -= 1;
  mostrarResumen();
  actualizarCatalogo();
}

// Eventos principales de la pagina.
filtroCategoria.addEventListener("change", () => {
  actualizarCatalogo();
});

btnGuardar.addEventListener("click", () => {
  localStorage.setItem("pcArmada", JSON.stringify(pcArmada));

  mostrarMensaje({
    icon: "success",
    title: "Armado guardado",
    text: "Tu configuración fue guardada correctamente.",
  });
});

btnLimpiar.addEventListener("click", () => {
  pcArmada = [];
  localStorage.removeItem("pcArmada");
  mostrarResumen();
  actualizarCatalogo();

  mostrarMensaje({
    icon: "info",
    title: "Armado limpio",
    text: "Se eliminaron todos los componentes seleccionados.",
  });
});

btnFinalizar.addEventListener("click", () => {
  const categoriasFaltantes = obtenerCategoriasFaltantes();

  if (categoriasFaltantes.length > 0) {
    mostrarMensaje({
      icon: "error",
      title: "PC incompleta",
      html: `Te falta seleccionar: <strong>${categoriasFaltantes.join(", ")}</strong>.`,
    });
    return;
  }

  const problemasCompatibilidad = obtenerProblemasCompatibilidad(pcArmada);

  if (problemasCompatibilidad.length > 0) {
    mostrarMensaje({
      icon: "error",
      title: "Componentes incompatibles",
      html: problemasCompatibilidad.map((problema) => `<p>${problema}</p>`).join(""),
    });
    return;
  }

  mostrarMensaje({
    icon: "success",
    title: "PC configurada con éxito",
    html: `Tu PC gamer fue armada correctamente.<br>Total: <strong>L ${formatearPrecio(calcularTotalNumero())}</strong>.`,
  });
});

// Revisa si el producto nuevo choca con lo que ya fue elegido.
function obtenerProblemasParaAgregar(componente) {
  const itemEnCarrito = buscarItemCarrito(componente.id);

  if (itemEnCarrito) {
    return [];
  }

  return obtenerProblemasCompatibilidad([...pcArmada, { ...componente, cantidad: 1 }]);
}

// Simula una nueva cantidad para validar antes de modificar el carrito real.
function obtenerProblemasParaCantidad(id, nuevaCantidad) {
  const carritoSimulado = pcArmada.map((item) => {
    if (item.id === id) {
      return { ...item, cantidad: nuevaCantidad };
    }

    return item;
  });

  return obtenerProblemasCompatibilidad(carritoSimulado);
}

// Valida la compatibilidad importante: socket y tipo de memoria RAM.
function obtenerProblemasCompatibilidad(listaComponentes) {
  const problemas = [];
  const procesadores = listaComponentes.filter(
    (componente) => componente.categoria === "procesador",
  );
  const motherboards = listaComponentes.filter(
    (componente) => componente.categoria === "motherboard",
  );
  const memoriasRam = listaComponentes.filter(
    (componente) => componente.categoria === "ram",
  );

  procesadores.forEach((procesador) => {
    motherboards.forEach((motherboard) => {
      if (procesador.socket !== motherboard.socket) {
        problemas.push(
          `${procesador.nombre} no es compatible con ${motherboard.nombre}: el socket debe coincidir.`,
        );
      }
    });
  });

  motherboards.forEach((motherboard) => {
    memoriasRam.forEach((ram) => {
      if (motherboard.ramTipo !== ram.ramTipo) {
        problemas.push(
          `${ram.nombre} no es compatible con ${motherboard.nombre}: el tipo de memoria debe ser ${motherboard.ramTipo}.`,
        );
      }
    });
  });

  return problemas;
}

// El monitor es opcional, el resto de categorias completa la PC.
function obtenerCategoriasFaltantes() {
  return Object.entries(categorias)
    .filter(([, categoria]) => categoria.requerida)
    .filter(([id]) => {
      return !pcArmada.some((componente) => componente.categoria === id);
    })
    .map(([, categoria]) => categoria.nombre);
}

// Calcula el total sumando precio por cantidad de cada producto.
function calcularTotalNumero() {
  return pcArmada.reduce((acumulador, componente) => {
    return acumulador + componente.precio * componente.cantidad;
  }, 0);
}

// Suma el consumo de los componentes y agrega un margen base del sistema.
function calcularConsumoEstimado(listaComponentes = pcArmada) {
  const consumoBase = listaComponentes.reduce((acumulador, componente) => {
    return acumulador + (componente.consumo || 0) * componente.cantidad;
  }, 0);

  return consumoBase === 0 ? 0 : consumoBase + 70;
}

// Convierte las especificaciones del JSON en una lista HTML.
function obtenerSpecsHTML(componente) {
  const specs = componente.specs || [];

  return specs.map((spec) => `<li>${spec}</li>`).join("");
}

// Formato de moneda para mostrar precios en lempiras.
function formatearPrecio(precio) {
  return precio.toLocaleString("es-HN");
}

// Traduce el id de categoria a un nombre mas claro para el usuario.
function formatearCategoria(categoria) {
  return categorias[categoria] ? categorias[categoria].nombre : categoria;
}

// Muestra mensajes con SweetAlert2, la libreria externa del proyecto.
function mostrarMensaje(opciones) {
  if (window.Swal) {
    Swal.fire(opciones);
  }
}

// Busca si un producto ya esta dentro del armado.
function buscarItemCarrito(id) {
  return pcArmada.find((item) => item.id === id);
}

// Asegura que los productos guardados tengan una cantidad valida.
function normalizarCarrito(items) {
  return items.map((item) => {
    return {
      ...item,
      cantidad: Math.max(1, Number(item.cantidad) || 1),
    };
  });
}
