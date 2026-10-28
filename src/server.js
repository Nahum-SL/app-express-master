require("dotenv").config();
require("./config/env");

const app = require("./app");
const db = require("./config/db");

const port = process.env.PORT || 3000;

db.raw("select 1")
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor iniciado en http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error(`No se pudo realizar la conexión: ${e.message}`);
    process.exitCode = 1;
  });
