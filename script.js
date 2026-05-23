// --- Simulación de Base de Datos Local (para demostración) ---
// En una aplicación real, estos datos vendrían de un backend.
let inventario = [
    { id: 1, nombre: "Laptop Modelo X", descripcion: "Potente laptop para diseño", stock: 15, precio_compra: 800.00, precio_venta: 1200.00 },
    { id: 2, nombre: "Teclado Mecánico RGB", descripcion: "Teclado para gamers", stock: 50, precio_compra: 50.00, precio_venta: 80.00 },
    { id: 3, nombre: "Monitor 27 Pulgadas", descripcion: "Pantalla Full HD", stock: 25, precio_compra: 150.00, precio_venta: 250.00 }
];

let ventas = [
    { id: 1, fecha: "2023-10-25", producto_id: 1, producto_nombre: "Laptop Modelo X", cantidad: 1, precio_unitario: 1200.00, total: 1200.00 },
    { id: 2, fecha: "2023-10-26", producto_id: 2, producto_nombre: "Teclado Mecánico RGB", cantidad: 2, precio_unitario: 80.00, total: 160.00 }
];

let nextProductoId = 4; // Para simular IDs autoincrementales
let nextVentaId = 3;    // Para simular IDs autoincrementales

// --- Funciones del Inventario ---

function renderTablaInventario() {
    const tablaBody = document.querySelector("#tabla-inventario tbody");
    tablaBody.innerHTML = ''; // Limpiar la tabla

    inventario.forEach(producto => {
        const row = `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.stock}</td>
                <td>$${producto.precio_compra.toFixed(2)}</td>
                <td>$${producto.precio_venta.toFixed(2)}</td>
                <td>
                    <button onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="delete" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>
        `;
        tablaBody.innerHTML += row;
    });
}

function guardarProducto(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const id = document.getElementById('producto-id').value;
    const nombre = document.getElementById('nombre-producto').value;
    const descripcion = document.getElementById('descripcion-producto').value;
    const stock = parseInt(document.getElementById('stock-producto').value);
    const precioCompra = parseFloat(document.getElementById('precio-compra').value);
    const precioVenta = parseFloat(document.getElementById('precio-venta').value);

    if (id) {
        // Editar producto existente
        const index = inventario.findIndex(p => p.id == id);
        if (index !== -1) {
            inventario[index] = { id: parseInt(id), nombre, descripcion, stock, precio_compra: precioCompra, precio_venta: precioVenta };
        }
    } else {
        // Agregar nuevo producto
        const nuevoProducto = {
            id: nextProductoId++,
            nombre,
            descripcion,
            stock,
            precio_compra: precioCompra,
            precio_venta: precioVenta
        };
        inventario.push(nuevoProducto);
    }

    renderTablaInventario();
    renderOpcionesProductos(); // Actualizar dropdown de ventas
    resetForm();
    alert('Producto guardado exitosamente.');
}

function editarProducto(id) {
    const producto = inventario.find(p => p.id === id);
    if (producto) {
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('nombre-producto').value = producto.nombre;
        document.getElementById('descripcion-producto').value = producto.descripcion;
        document.getElementById('stock-producto').value = producto.stock;
        document.getElementById('precio-compra').value = producto.precio_compra;
        document.getElementById('precio-venta').value = producto.precio_venta;
    }
}

function eliminarProducto(id) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        inventario = inventario.filter(p => p.id !== id);
        renderTablaInventario();
        renderOpcionesProductos(); // Actualizar dropdown de ventas
        alert('Producto eliminado.');
    }
}

function resetForm() {
    document.getElementById('producto-form').reset();
    document.getElementById('producto-id').value = ''; // Limpiar el ID oculto
}

// --- Funciones de Ventas ---

function renderTablaVentas() {
    const tablaBody = document.querySelector("#tabla-ventas tbody");
    tablaBody.innerHTML = ''; // Limpiar la tabla

    ventas.forEach(venta => {
        const row = `
            <tr>
                <td>${venta.id}</td>
                <td>${venta.fecha}</td>
                <td>${venta.producto_nombre}</td>
                <td>${venta.cantidad}</td>
                <td>$${venta.precio_unitario.toFixed(2)}</td>
                <td>$${venta.total.toFixed(2)}</td>
            </tr>
        `;
        tablaBody.innerHTML += row;
    });
}

function renderOpcionesProductos() {
    const selectProducto = document.getElementById('producto-venta');
    selectProducto.innerHTML = '<option value="">Seleccione un producto</option>'; // Limpiar y agregar opción por defecto

    inventario.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.id;
        option.textContent = `${producto.nombre} (Stock: ${producto.stock})`;
        option.dataset.precio = producto.precio_venta; // Almacenar precio para fácil acceso
        selectProducto.appendChild(option);
    });
}

function registrarVenta(event) {
    event.preventDefault();

    const productoId = parseInt(document.getElementById('producto-venta').value);
    const cantidad = parseInt(document.getElementById('cantidad-venta').value);
    const selectedOption = document.getElementById('producto-venta').selectedOptions[0];
    const precioUnitario = parseFloat(selectedOption.dataset.precio);

    if (!productoId || isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, seleccione un producto y una cantidad válida.');
        return;
    }

    const producto = inventario.find(p => p.id === productoId);

    if (!producto) {
        alert('Producto no encontrado.');
        return;
    }

    if (cantidad > producto.stock) {
        alert(`Stock insuficiente. Stock actual: ${producto.stock}`);
        return;
    }

    const total = precioUnitario * cantidad;
    const fechaActual = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD

    const nuevaVenta = {
        id: nextVentaId++,
        fecha: fechaActual,
        producto_id: productoId,
        producto_nombre: producto.nombre,
        cantidad: cantidad,
        precio_unitario: precioUnitario,
        total: total
    };
    ventas.push(nuevaVenta);

    // Actualizar stock del inventario
    producto.stock -= cantidad;

    renderTablaVentas();
    renderTablaInventario(); // Actualizar tabla de inventario con nuevo stock
    renderOpcionesProductos(); // Actualizar dropdown de ventas con stock actualizado
    document.getElementById('venta-form').reset(); // Limpiar formulario de venta
    alert('Venta registrada exitosamente.');
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    renderTablaInventario();
    renderTablaVentas();
    renderOpcionesProductos();

    // Event Listeners para los formularios
    document.getElementById('producto-form').addEventListener('submit', guardarProducto);
    document.getElementById('venta-form').addEventListener('submit', registrarVenta);

    // Event Listener para buscar productos
    document.getElementById('buscar-producto').addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const tablaBody = document.querySelector("#tabla-inventario tbody");
        const rows = tablaBody.querySelectorAll('tr');

        rows.forEach(row => {
            const nombre = row.cells[1].textContent.toLowerCase();
            const descripcion = row.cells[2].textContent.toLowerCase();
            if (nombre.includes(searchTerm) || descripcion.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Event Listener para actualizar total de venta automáticamente
    document.getElementById('producto-venta').addEventListener('change', () => {
        const selectedOption = document.getElementById('producto-venta').selectedOptions[0];
        const precioUnitarioInput = document.getElementById('precio-unitario-venta');
        const totalVentaInput = document.getElementById('total-venta');

        if (selectedOption.value) {
            const precio = parseFloat(selectedOption.dataset.precio);
            precioUnitarioInput.value = precio.toFixed(2);
            // Calcular el total si ya hay una cantidad ingresada
            const cantidad = parseInt(document.getElementById('cantidad-venta').value);
            if (!isNaN(cantidad) && cantidad > 0) {
                totalVentaInput.value = (precio * cantidad).toFixed(2);
            } else {
                totalVentaInput.value = '0.00';
            }
        } else {
            precioUnitarioInput.value = '';
            totalVentaInput.value = '0.00';
        }
    });

    document.getElementById('cantidad-venta').addEventListener('input', () => {
        const selectedOption = document.getElementById('producto-venta').selectedOptions[0];
        const precioUnitarioInput = document.getElementById('precio-unitario-venta');
        const totalVentaInput = document.getElementById('total-venta');

        if (selectedOption.value) {
            const precio = parseFloat(selectedOption.dataset.precio);
            const cantidad = parseInt(document.getElementById('cantidad-venta').value);

            precioUnitarioInput.value = precio.toFixed(2);
            if (!isNaN(cantidad) && cantidad > 0) {
                totalVentaInput.value = (precio * cantidad).toFixed(2);
            } else {
                totalVentaInput.value = '0.00';
            }
        }
    });
});
