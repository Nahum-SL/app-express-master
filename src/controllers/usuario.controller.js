const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { httpError, requireFields, checkCredentials } = require("../utils");

// Perfiles o roles de usuarios
const NIVELES = ["admin", "usuario"];

// Consultar base
const baseQuery = () => {
  db("usuarios as u")
    .join("personas as p", "p.id", "u.idpersona")
    .select(
      "u.id",
      "u.idpersona",
      "u.nombre_usuario",
      "u.nivel_acceso",
      "u.estado",
      "p.apellidos",
      "p.nombres",
    );
};

// Verificar nivel (asegurar que solo sea un perfil de la lista)
const checkNivel = (nivel) => {
  if (nivel !== undefined && !NIVELES.includes(nivel)) {
    throw httpError(400, "Nivel de acceso incorrecto");
  }
};

exports.getList = async (req, res) => {
  const row = res.json(await baseQuery().where("u.id", req.params.id).first());
  if (!row) throw httpError(404, "Usuario no existe");
  res.json(row);
};

exports.get = async (req, res) => {
  res.json(await baseQuery().orderBy("u.id"));
};

exports.create = async (req, res) => {
  requireFields(req.body, ["idpersona", "nombre_usuario", "clave_acceso"]);

  // Deserializar los datos que vienen en body
  const { idpersona, nombre_usuario, clave_acceso, nivel_acceso, estado } =
    req.body;

  // Verificar que el nivel sea correcto
  checkNivel(nivel_acceso);

  //Verificar credencial (permiso)
  checkCredentials(req.body, { claveObligatoria: true });

  // Creamos el usuario
  const [id] = await db("usuarios").insert({
    idpersona,
    nombre_usuario,
    nivel_acceso,
    estado,
    clave_acceso: await bcrypt.hash(clave_acceso, 10),
  });

  res.status(201).json({ id, message: "Usuario creado" });
};


exports.update = async (req, res) => {

};

exports.delete = async (req, res) => {
  // ¿Es posible eliminar tu propio usuario?
  // SI [] - NO [X]
  if (Number(req.params.id) === req.user.id) {
    throw httpError(400, "No puedes eliminar tu propio ");
  }

  const num = await db("usuarios").where({ id: req.params.id }).del();

  if (!num) throw httpError(404, "Usuario no encontrada");

  res.json({ message: "Usuario eliminado" });
};
