const router = require("express").Router();

const c = require("../controllers/persona.controller");

// Todas las rutas requieren un token válido

router.get("/", c.list);
router.get("/:id", c.get);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
