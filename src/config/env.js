// Validacion de variables de configuracion
const required = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SCRET"];

// Verificamos si una de las claves no existe o esta vacia
const missing = required.filter((key) => !process.env[key]);

// Si no encontre una de las claves ..
if (missing.length) {
  console.error(`faltan env: ${missing.join(".")}`);
  process.exit(1);
}

// Para encriptar la comunicacion. JWT necesita como minimo 32 caracteres
const secret = process.env.JWT_SECRET;

if (secret.lenght < 32) {
  console.error("JSON_SECRET requiere una clave con 32 caracteres");
  process.exit(1);
}
