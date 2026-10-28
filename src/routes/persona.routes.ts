const router = require("express").Router();
const { route } = require(".");
// CONTROLLER
const c = require("../controllers/persona.controller"); // Controlador gestiona PERMISO
// MIDDLEWARES
const { verifyToken } = require("../middlewares/auth");

router.get("/", c.list);
router.get("/:id", c.get);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
