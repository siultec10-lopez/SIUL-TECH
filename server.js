const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 5500;
const ROOT = __dirname;

// Tipos de archivo que el servidor debe entregar al navegador.
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

// Servidor local simple para poder usar fetch sin abrir el HTML directo.
const server = http.createServer((request, response) => {
  const requestedPath = decodeURIComponent(request.url.split("?")[0]);
  const safePath = requestedPath === "/" ? "/index.html" : requestedPath;
  const filePath = path.normalize(path.join(ROOT, safePath));

  // Evita que una ruta del navegador salga de la carpeta del proyecto.
  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Acceso denegado");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Archivo no encontrado");
      return;
    }

    // Si el archivo existe, lo envio con su tipo correcto.
    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
    });
    response.end(content);
  });
});

server.listen(PORT);
