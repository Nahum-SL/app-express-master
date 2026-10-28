const required = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];

// Verificar variables faltantes o vacías
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Faltan variables de entorno: ${missing.join(", ")}`);
  process.exit(1);
}

// Validar secreto JWT
const secret = process.env.JWT_SECRET;

if (secret.length < 32) {
  console.error("JWT_SECRET requiere una clave de al menos 32 caracteres");
  process.exit(1);
}
