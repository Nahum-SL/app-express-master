const router = require("express").Router();

// JWT = limitar el uso de las rutas
const { verifyToken, requireLevel } = require("../middlewares/auth");

const personaRoutes = require("./persona.routes");
const usuarioRoutes = require("./usuario.routes");
const authRoutes = require("./auth.routes");

// Rutas App (Expandiendo segun modulos)
// Version 1: login publico
router.use("/auth", authRoutes);
router.use("/personas", verifyToken, personaRoutes);
router.use("/usuarios", verifyToken, requireLevel("admin"), usuarioRoutes);

module.exports = router;
