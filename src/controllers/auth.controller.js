const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { httpError, requireFields } = require("../utils");

// Configuracion cookies
const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

// HASH temporal para evaluar la contraseña
const DUMMY_HASH = bcrypt.hashSync("contraseña-ficticia", 10);

exports.login = async (req, res) => {
  // Validacion
  requireFields(req.body, ["nombre_usuario", "clave_acceso"]);
  // Deserialización
  const { nombre_usuario, clave_acceso } = req.body;

  // Validar el tipo de dato (seguridad XSS)
  if (typeof nombre_usuario !== "string" || typeof clave_acceso !== "string") {
    throw httpError(400, "Datos no son correctos");
  }

  // Realiza una busqueda, devolviendo la primera coincidencia
  const user = await db("usuarios").where({ nombre_usuario }).first();

  const valid = await bcrypt.compare(
    clave_acceso,
    user?.clave_acceso ?? DUMMY_HASH,
  );

  // Si no existe el usuario OR si existe pero su estado (false) OR si la clave es incorrecta
  if (!user || !user.estado || !valid) {
    throw httpError(401, "Usuario o contraseña incorrecta");
  }

  // Si llegaste hasta aqui - USUARIO AUTENTICADO
  const token = jwt.sign(
    {
      id: user.id,
      nombre_usuario: user.nombre_usuario,
      nivel_acceso: user.nivel_acceso,
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      subject: String(user.id),
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  res.cookie("token", token, cookieOpts).json({ message: "Bienvenido" });
};

exports.logout = async (req, res) => {
  res.clearCookie("token", cookieOpts).json({ message: "Sesion finalizada" });
};

// Funcion que retorne la informacion completa del usuario
// usuario > persona

exports.me = async (req, res) => {
  if (!req.auth?.id) {
    throw httpError(401, "No autenticado");
  }

  const user = await db("usuarios as u")
    .join("personas as p", "p.id", "u.idpersona")
    .where("u.id", req.auth.id)
    .select(
      "u.id",
      "u.nombre_usuario",
      "u.nivel_acceso",
      "p.nombres",
      "p.apellidos",
    )
    .first();

  if (!user) {
    throw httpError(404, "Usuario no encontrado");
  }

  res.json(user);
};
