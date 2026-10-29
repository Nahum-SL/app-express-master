let personas = [];
let usuarios = [];
let idPersonaEditando = null;
let idUsuarioEditando = null;

async function llamarApi(url, metodo = "GET", datos) {
  const opciones = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  };

  if (datos !== undefined) {
    opciones.body = JSON.stringify(datos);
  }

  const respuesta = await fetch(url, opciones);

  if (respuesta.status === 401) {
    window.location.href = "/login.html";
    throw new Error("Sesión expirada o no autorizada");
  }

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.message || "Error al procesar la solicitud");
  }

  return resultado;
}

async function iniciar() {
  try {
    const me = await llamarApi("/api/auth/me");

    document.getElementById("who").textContent =
      `${me.nombres} ${me.apellidos} (${me.nivel_acceso})`;

    // Si eres ADMIN, puedes habilitar funciones adicionales.
  } catch (error) {
    if (
      error instanceof Error &&
      error.message !== "Sesión expirada o no autorizada"
    ) {
      console.error("Error al iniciar la aplicación:", error);
    }
  }
}

iniciar();
