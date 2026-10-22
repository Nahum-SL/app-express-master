/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("usuarios").del();
  await knex("personas").del();

  await knex("personas").insert([
    {
      id: 1,
      apellidos: "Salazar",
      nombres: "Nahum",
      telefono: "987654321",
      email: "nahum@gmail.com",
      direccion: "Av. rosales",
    },
    {
      id: 2,
      apellidos: "Casas",
      nombres: "Raul",
      telefono: "988654321",
      email: "raul@gmail.com",
      direccion: "Jiron de la union",
    },
    {
      id: 3,
      apellidos: "Miranda",
      nombres: "Roxana",
      telefono: "987654322",
      email: "roxana@gmail.com",
      direccion: "Av brasil",
    },
  ]);

  await knex("usuarios").insert([
    {
      id: 1,
      idpersona: 1,
      nombre_usuario: "admin",
      clave_acceso: bcrypt.hashSync("hugo123*", 10),
      nivel_acceso: "admin",
      estado: true,
    },
    {
      id: 2,
      idpersona: 2,
      nombre_usuario: "usuario",
      clave_acceso: bcrypt.hashSync("paco123*", 10),
      nivel_acceso: "usuario",
      estado: true,
    },
  ]);
};
