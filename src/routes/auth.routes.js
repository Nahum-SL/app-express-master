const router = require("express").Router();
// CONTROLLER
const { login, logout, me } = require("../controllers/auth.controller"); // Controlador gestiona PERMISO
// MIDDLEWARES
const { verifyToken } = require("../middlewares/auth");
const { loginLimiter } = require("../middlewares/rateLimit");

router.post("/login", loginLimiter, login);
router.post("/logout", logout);
route.get("/me", verifyToken, me);

module.exports = router;
