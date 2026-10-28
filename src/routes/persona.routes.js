const router = require("express").Router();

const c = require("../controllers/persona.controller");
const { verifyToken } = require("../middlewares/auth");

// Todas las rutas requieren un token válido
router.use(verifyToken);

router.get("/", c.list);
router.get("/:id", c.get);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
