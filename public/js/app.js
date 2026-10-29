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

// =========================
// FUNCIONES UTILS
// =========================

function crearFilaVacia(columnas) {
  const fila = document.createElement("tr");
  const celda = document.createElement("td");
  celda.colSpan = columnas;
  celda.textContent = "Aún no hay registros";
  fila.appendChild(celda);
  return fila; // Agregar al cuerpo de la tabla
}

function crearBoton(texto, clases) {
  const boton = document.createElement("button");
  boton.textContent = texto;
  boton.className = clases;
  return boton; // Agregar en cualquier parte del DOM
}

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto || "";
  return celda;
}

// =========================
// ACCESO AL SISTEMA
// =========================
async function iniciar() {
  try {
    const me = await llamarApi("/api/auth/me");

    document.getElementById("who").textContent =
      `${me.nombres} ${me.apellidos} (${me.nivel_acceso})`;

    cargarPersonas();

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

async function cerrarSesion() {
  await llamarApi("/api/auth/logout", "POST");
  window.location.href = "/login.html";
}

async function cargarPersonas() {
  personas = await llamarApi("/api/personas");
  const cuerpo = document.getElementById("cuerpoPersonas");
  cuerpo.innerHTML = "";

  if (personas.length === 0) {
    cuerpo.appendChild(crearFilaVacia(6));
    return;
  }

  personas.forEach((p) => {
    const fila = document.createElement("tr");

    fila.appendChild(crearCelda(p.apellidos));
    fila.appendChild(crearCelda(p.nombres));
    fila.appendChild(crearCelda(p.telefono));
    fila.appendChild(crearCelda(p.email));
    fila.appendChild(crearCelda(p.direccion));
    // fila.appendChild(crearCelda());

    // Crear 2 botones

    const celdaBotones = document.createElement("td"); // <td></td>
    const botonEditar = crearBoton("Editar", "btn"); // <button></button>
    const botonEliminar = crearBoton("Eliminar", "btn"); // <button></button>

    // Agregar eventos a los botones
    botonEditar.onclick = function () {
      abrirFormularioPersonas(p);
    };

    botonEliminar.onclick = function () {
      eliminarPersona(p.id);
    };

    celdaBotones.appendChild(botonEditar);
    celdaBotones.appendChild(botonEliminar);

    fila.appendChild(celdaBotones);

    cuerpo.appendChild(fila);
  });
}

function abrirFormularioPersonas(persona) {
  if (persona) {
    idPersonaEditando = persona.id;
    dialgoTitel.textContent = "Editar persona";

    document.getElementById("apellidos").value = persona.apellidos;
    document.getElementById("nombres").value = persona.nombres;
    document.getElementById("telefono").value = persona.telefono;
    document.getElementById("email").value = persona.email;
    document.getElementById("direccion").value = persona.direccion;
  } else {
    idPersonaEditando = null;
    dialgoTitel.textContent = "Nueva persona";
  }

  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById("dialogPersona"),
  );

  modal.show();
}

async function eliminarPersona(id) {
  if (!confirm("¿Eliminamos esta persona?")) {
    return;
  }

  try {
    await llamarApi(`/api/personas/${id}`, "DELETE");
    await cargarPersonas();
  } catch (error) {
    alert(error.message);
  }
}

// Se ejecutara desde el submit requeridos el event para detenerlo
async function guardarPersona(event) {
  event.preventDefault();

  const error = document.getElementById("errorPersona");
  error.textContent = "";

  const datos = {
    apellidos: document.getElementById("apellidos").value.trim(),
    nombres: document.getElementById("nombres").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    email: document.getElementById("email").value.trim(),
    direccion: document.getElementById("direccion").value.trim(),
  };

  try {
    if (idPersonaEditando !== null) {
      await llamarApi(`/api/personas/${idPersonaEditando}`, "PUT", datos);
    } else {
      await llamarApi("/api/personas", "POST", datos);
    }

    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("dialogPersona"),
    ).hide();

    await cargarPersonas();
  } catch (error) {
    document.getElementById("errorPersona").textContent = error.message;
  }
}

// Manejadores de eventos
document.getElementById("logout").addEventListener("click", cerrarSesion);
document.getElementById("nuevaPersona").addEventListener("click", function () {
  abrirFormularioPersonas(null);
});

document
  .getElementById("formPersona")
  .addEventListener("submit", guardarPersona);

iniciar();
