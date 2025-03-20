// URL de la API
const API_URL = "http://localhost:3000";

// Obtener la lista de productos y mostrarlos
async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/`);
        if (!response.ok) throw new Error("Error al obtener productos");
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron cargar los productos.");
    }
}

// Función para mostrar productos en el contenedor
function mostrarProductos(productos) {
    const contenedor = document.querySelector(".container-list");
    contenedor.innerHTML = ""; // Limpiar antes de agregar

    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3 class="card-title">${producto.name}</h3>
            <p class="card-stock">Stock: ${producto.stock}pz</p>
            <div>
                <button class="card-button card-button_edit" data-id="${producto._id}">
                    <i class="bi bi-pen"></i>
                </button>
                <span class="card-precio">$${producto.price}</span>
            </div>
        `;
        contenedor.appendChild(card);
    });

    // Asignar eventos a los botones de edición
    document.querySelectorAll(".card-button_edit").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const id = e.target.closest("button").dataset.id;
            cargarProductoParaEditar(id);
        });
    });
}

// Función para filtrar productos
async function filtrarProductos() {
    const searchText = document.querySelector("#search").value.toLowerCase().trim();
    if (searchText.length === 0) return cargarProductos(); // Si está vacío, recargar todos

    try {
        const response = await fetch(`${API_URL}/`);
        if (!response.ok) throw new Error("Error al obtener productos");
        const productos = await response.json();

        // Filtrar productos por nombre
        const productosFiltrados = productos.filter(producto =>
            producto.name.toLowerCase().includes(searchText)
        );

        mostrarProductos(productosFiltrados);
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron filtrar los productos.");
    }
}

// Cargar datos en el formulario para edición
async function cargarProductoParaEditar(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el producto");
        const producto = await response.json();

        document.querySelector("input[name='name']").value = producto.name;
        document.querySelector("input[name='precio']").value = producto.price;
        document.querySelector("input[name='stock']").value = producto.stock;
        document.querySelector(".form").dataset.id = id; // Guardar ID en el formulario
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar la información del producto.");
    }
}

// Enviar actualización
document.querySelector(".form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = e.target.dataset.id;
    const name = document.querySelector("input[name='name']").value.trim();
    const price = parseFloat(document.querySelector("input[name='precio']").value);
    const stockInput = document.querySelector("input[name='stock']").value.trim();
    
    // Validación de stock para permitir solo números enteros
    if (!/^\d+$/.test(stockInput)) {
        alert("El stock debe ser un número entero válido.");
        return;
    }
    const stock = parseInt(stockInput, 10);

    // Validación de datos
    if (!name || isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
        alert("Por favor, ingresa valores válidos.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, stock })
        });

        if (!response.ok) throw new Error("Error al actualizar el producto");

        alert("Producto actualizado correctamente");
        cargarProductos(); // Recargar la lista
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo actualizar el producto.");
    }
});

// Evento para la barra de búsqueda
document.querySelector("#search").addEventListener("input", filtrarProductos);

// Cargar productos al iniciar
cargarProductos();