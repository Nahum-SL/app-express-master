// GEstor manejo de errores
exports.notFound = (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
};

exports.errorHandler = (err, _req, res, next) => {
  // Si existe un error ... detenemos y retornamos un mensaje en formato JSON
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err.code === "ER_DUP_ENTRY") {
    return res
      .status(409)
      .json({ message: "Ya existe un registro con ese valor" });
  }

  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    return res
      .status(409)
      .json({ message: "No se puede eliminar, registro en uso" });
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ message: "No existe el registro indicado" });
  }

  console.error(err);

  res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
  });
};
