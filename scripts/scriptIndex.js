
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos(); // Cargar productos al iniciar

    document.getElementById("search").addEventListener("input", (e) => {
        let query = e.target.value.trim(); // Obtener valor del input
        if (query.length > 0) {
            buscarProductos(query);
        } else {
            cargarProductos(); // Si está vacío, recargar todos los productos
        }
    });
});

function cargarProductos() {
    fetch("http://localhost:3000/")
        .then(response => response.json())
        .then(data => mostrarProductos(data))
        .catch(error => console.error("Error al obtener productos:", error));
}

function buscarProductos(nombre) {
    fetch(`http://localhost:3000/search?name=${nombre}`)
        .then(response => response.json())
        .then(data => mostrarProductos(data))
        .catch(error => console.error("Error en la búsqueda:", error));
}



function mostrarProductos(productos) {
    let lista = document.querySelector(".container-list");
    lista.innerHTML = ""; // Limpiar lista antes de agregar productos

    productos.forEach(producto => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3 class="card-title">${producto.name}</h3>
            <p class="card-stock">Stock: ${producto.stock} pz</p>
            <div>
                <button class="card-button card-button_delete" data-id="${producto._id}">
                    <i class="bi bi-trash-fill"></i> 
                </button>
                <span class="card-precio">$${producto.price}</span>
            </div>
        `;
        lista.appendChild(card);
    });

    // Agregar evento a los botones de eliminar
    document.querySelectorAll(".card-button_delete").forEach(button => {
        button.addEventListener("click", (e) => {
            let id = e.target.closest("button").dataset.id; // Obtener ID del producto
            eliminarProducto(id);
        });
    });
}


function eliminarProducto(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    fetch(`http://localhost:3000/${id}`, {
        method: "DELETE",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar el producto");
        }
        return response.json();
    })
    .then(data => {
        console.log("Producto eliminado:", data);
        cargarProductos(); // Recargar lista después de eliminar
    })
    .catch(error => console.error("Error:", error));
}
