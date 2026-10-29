document
  .getElementById("#form_login")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    // Verificar los datos
    const resultLogin = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.target))),
    });

    // ATributo OK - 2XX (TRUE)
    if (resultLogin.ok) {
      location.href = "../index.html";
    } else {
      document.getElementById("mensaje").textContent =
        await resultLogin.json().message;
    }
  });
