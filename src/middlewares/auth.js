const jwt = require("jsonwebtoken");
const db = require("../config/db");

// No se exporta por que colabora el verifyToken
// Error 1: No authorizado
// Error 2: Expirado

const unauthorized = (res, msg = "No authorizado") => {
  res.status(401).json({ message: msg });
};

exports.verifyToken = async (req, res, next) => {
  // Cookies = archivos que guardan la configuracion
  // NOTA: En tu navegador -> INSPECCIONAR
  const token = req.cookies.token;

  // Si no existe token, no puedes acceder a la App
  if (!token) {
    return unauthorized(res);
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    return unauthorized(res, "Sesión inválida o expirada");
  }

  // Se consulta la BD para respetar usuarios desactivaos
  const user = await db("usuarios")
    .where({ id: payload.id })
    .select("id", "nombre_usuario", "nivel_acceso", "estado")
    .first();

  if (!user || !user.estado) {
    return unauthorized(res, "Usuario inactivo o inexistente");
  }

  req.user = user;
  next();
};

exports.requireLevel =
  (...niveles) =>
  (req, res, next) => {
    niveles.includes(req.user.nivel_acceso)
      ? next()
      : res.status(403).json("No tienes permiso para esta accion");
  };
