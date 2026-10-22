const router = require("express").Router();
const { route } = require(".");
// CONTROLLER
const {} = require("../controllers/persona.controller"); // Controlador gestiona PERMISO
// MIDDLEWARES
const { verifyToken } = require("../middlewares/auth");

router.get("/");
router.get("/:id");
router.post("/");
router.put("/:id");
router.delete("/:id");

module.exports = router;
