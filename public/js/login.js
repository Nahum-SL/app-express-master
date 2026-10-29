const formulario = document.getElementById("form_login");
const mensaje = document.getElementById("mensaje");
const boton = formulario.querySelector('button[type="submit"]');

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  mensaje.textContent = "";
  boton.disabled = true;

  try {
    const respuesta = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(Object.fromEntries(new FormData(formulario))),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.message || "No se pudo iniciar sesión");
    }

    window.location.href = "/index.html";
  } catch (error) {
    mensaje.textContent =
      error instanceof Error
        ? error.message
        : "Error de conexión con el servidor";
  } finally {
    boton.disabled = false;
  }
});
