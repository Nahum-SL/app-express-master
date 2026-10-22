const router = require("express").Router();
// CONTROLLER
const c = require("../controllers/auth.controller"); // Controlador gestiona PERMISO
// MIDDLEWARES
const { verifyToken } = require("../middlewares/auth");
const { loginLimiter } = require("../middlewares/rateLimit");

router.post("/login", loginLimiter, c);
