/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("personas", (t) => {
    t.increments("id").primary();
    t.string("apellidos", 100).notNullable();
    t.string("nombres", 100).notNullable();
    t.string("telefono", 9);
    t.string("email", 120);
    t.string("direccion", 150);
    // Fecha de creacion y modificacion
    t.timestamps(true, true);
  });

  await knex.schema.createTable("usuarios", (t) => {
    t.increments("id").primary();
    t.integer("idpersona")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("personas")
      .onDelete("RESTRICT");

    t.string("nombre_usuario", 50).notNullable().unique();
    t.string("clave_acceso", 255).notNullable();
    t.enu("nivel_acceso", ["admin", "usuario"])
      .notNullable()
      .defaultTo("usuario");

    t.boolean("estado").notNullable().defaultTo(true);
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("personas");
  await knex.schema.dropTableIfExists("usuarios");
};
