const router = require("express").Router();
const c = require("../controllers/usuario.controller");

router.get("/", c.getList);
router.get("/:id", c.get);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.delete);

module.exports = router;
