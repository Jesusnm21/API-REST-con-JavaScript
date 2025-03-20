document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector(".formulario");

    formulario.addEventListener("submit", function (e) {
        e.preventDefault(); 

        // Obtener valores del formulario
        const name = document.getElementById("nombre").value.trim();
        const price = parseFloat(document.getElementById("precio").value);
        const stock = parseInt(document.getElementById("stock").value, 10);

        // Validar que los valores sean correctos antes de enviarlos
        if (!name || isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
            alert("Por favor, ingresa valores válidos.");
            return;
        }

        // Crear objeto con los datos del producto
        const nuevoProducto = { name, price, stock };

        // Enviar datos al backend con fetch
        fetch("http://localhost:3000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoProducto)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            alert("Producto agregado correctamente");
            formulario.reset(); // Limpiar formulario después de agregar
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un problema al agregar el producto.");
        });
    });
});
