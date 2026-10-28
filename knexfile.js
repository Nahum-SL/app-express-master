// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require("dotenv").config();


module.exports = {
  development: {
    client: "mysql2",
    connection: {
      database: process.env.DB_NAME || "app_pagos",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,

      charset: "utf8mb4",
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },
};
