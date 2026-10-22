const router = require("express").Router();

// JWT = limitar el uso de las rutas
const { verifyToken, requireLevel } = require("../middlewares/auth");

// Rutas App (Expandiendo segun modulos)
// Version 1: login publico
router.use("/auth", require("./auth.routes"));
router.use("/personas", verifyToken, require("./persona.routes"));
router.use(
  "/usuarios",
  verifyToken,
  requireLevel("admin"),
  require("./usuario.routes"),
);

module.exports = router;