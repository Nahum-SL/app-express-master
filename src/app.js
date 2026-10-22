require("dotenv").config();
const path = require("path"); // Gestion de rutas
const express = require("express"); //
const helmet = require("helmet"); // Seguridad - JWT (Json Web Token)
const cookieParser = require("cookie-parser"); // Cookie (Archivo guarda configuracion - navegador)

const routes = require("./routes");

// Otras configuraciones
const { apiLimiter } = require("./middlewares/rateLimit");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { contentSecurityPolicy } = require("helmet");

const app = express(); // Inicializar el express
const isProd = process.env.NODE_ENV === "production"; // Evalua el tipo de entorno

// Proxy = mascaras de navegacion (Nginx)
if (process.env.TRUST_PROXY)
  app.set("trust proxy", Number(process.env.TRUST_PROXY));

// Configuracion de seguridad
// Cross-Site Scripting (XSS)
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "style-src": ["'self'"],
        "upgrade-insecure-request": isProd ? [] : null,
      },
    },
  }),
);

// Configuracion de express
app.use(express.json({ limit: "10kb" })); // Tamaño max del JSON
app.use(cookieParser()); // Leer cookie (configuracion)
app.use(express.static(path.join(__dirname, "..", "public"))); // Ruta frontend

// Config de rutas
app.use("/api", apiLimiter, routes);

// Ruta raiz '/' localhost:3000, (prod) miapp.com
app.get("/", (req, res) => res.redirect("/index.html"));

//Manejamos rutas inexistentes
app.use("/api", notFound);
app.use(errorHandler);

module.exports = app;
