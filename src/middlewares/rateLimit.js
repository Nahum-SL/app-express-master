const rateLimit = require("express-rate-limit");
const { limit } = require("../config/db");

// Estas funciones controlaran la cantidad de intentos y el trafico en nuestra app
// "En localhost siempre funciona"
// "Con 1 usuario nunca hubo problemas"

/**
 * Flujo de login (intentos)
 * windowsMs      : tiempo de milisegundos
 * limit          : intentos por IP
 *
 *
 */
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: true,
  message: { message: "Demasiados intentos. verifique en unos minutos" },
});

// FLujo de solicitudes (usuarios que se conecten a la api)
exports.apiLimiter = rateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: true,
  message: { message: "Demasiadas solicitudes. intente en un momento" },
});
