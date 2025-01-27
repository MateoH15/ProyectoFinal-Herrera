const apiUrl = "https://v6.exchangerate-api.com/v6/"
const apiKey = "7ec399b322e56873b384e176"


function mostrarResultado(mensaje) {
    const resultadoDiv = document.querySelector(".resultados")
    resultadoDiv.innerHTML = `<p>${mensaje}</p>`
}

function guardarEnLocalStorage(conversion) {
    let historial = JSON.parse(localStorage.getItem("historialConversiones")) || []
    historial.push(conversion)
    localStorage.setItem("historialConversiones", JSON.stringify(historial))
}

function mostrarHistorial() {
    const listaHistorial = document.getElementById("lista-historial")
    listaHistorial.innerHTML = ""

    const historial = JSON.parse(localStorage.getItem("historialConversiones")) || []

    historial.forEach((conversion, index) => {
        const p = document.createElement("p")
        p.textContent = `${index + 1}. ${conversion}`
        listaHistorial.appendChild(p)
    });
}

function borrarHistorial() {
    localStorage.removeItem("historialConversiones")

    const listaHistorial = document.getElementById("lista-historial")
    listaHistorial.innerHTML = ""

    Toastify({

        text: "Historial Borrado",
        className: "info",
        position: "right",
        duration: 3000,
        backgroundColor: "#160b79",

    }).showToast();
}

function convertirDivisas() {
    const importe = document.querySelector(".container-importe input").value
    const monedaPrincipal = document.querySelector(".container-moneda-principal select").value
    const monedaConvertir = document.querySelector(".container-moneda-a-convertir select").value

    if (!importe || isNaN(importe)) {
        mostrarResultado("Por favor, ingresa un importe válido.")
        return
    }

    fetch(`${apiUrl}${apiKey}/latest/${monedaPrincipal}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.result === "success") {
                const tasaConversion = data.conversion_rates[monedaConvertir]
                const resultado = (importe * tasaConversion).toFixed(2)
                const mensaje = `El importe convertido es: ${resultado} ${monedaConvertir}`
                mostrarResultado(mensaje)

                const conversion = `${importe} ${monedaPrincipal} = ${resultado} ${monedaConvertir}`
                guardarEnLocalStorage(conversion)

                mostrarHistorial()
            } else {
                mostrarResultado("Error al obtener las tasas de conversión. Intenta nuevamente más tarde.")
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            mostrarResultado("Hubo un problema con la conversión. Por favor, intenta más tarde.")
        })

}

document.addEventListener("DOMContentLoaded", () => {
    mostrarHistorial()
    document.getElementById("borrar-historial").addEventListener("click", borrarHistorial)
});

document.querySelector(".boton-convertir button").addEventListener("click", convertirDivisas)
