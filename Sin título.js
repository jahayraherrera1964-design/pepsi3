
// =====================================
// 1. BASE DE DATOS DE PRODUCTOS
// =====================================

const products = [
    {
        id: 1,
        name: "Pepsi Clásica",
        category: "clasica",
        description: "El sabor original que todos conocen.",
        price: 3.50,
        badge: "POPULAR"
    },
    {
        id: 2,
        name: "Pepsi Zero Sugar",
        category: "zero",
        description: "El sabor Pepsi sin azúcar.",
        price: 4.00,
        badge: "SIN AZÚCAR"
    },
    {
        id: 3,
        name: "Diet Pepsi",
        category: "diet",
        description: "Una alternativa dietética.",
        price: 4.20,
        badge: "DIET"
    },
    {
        id: 4,
        name: "Pepsi Wild Cherry",
        category: "cereza",
        description: "Una variante con sabor a cereza.",
        price: 5.00,
        badge: "ESPECIAL"
    }
];

// =====================================
// 2. VARIABLES
// =====================================

let cart = [];
let activeFilter = "todos";
let searchText = "";

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

// =====================================
// 3. MOSTRAR PRODUCTOS
// =====================================

function renderProducts() {

    let filtered = products.filter(product => {

        const categoryMatch =
            activeFilter === "todos" ||
            product.category === activeFilter;

        const searchMatch =
            product.name.toLowerCase().includes(searchText);

        return categoryMatch && searchMatch;
    });

    const sort = document.getElementById("sortProducts").value;

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    document.getElementById("productCount").textContent =
        `${filtered.length} productos`;

    if (filtered.length === 0) {
        productGrid.innerHTML =
            `<p class="no-products">No encontramos productos.</p>`;
        return;
    }

    productGrid.innerHTML = filtered.map(product => `

        <article class="product-card">

            <span class="product-badge">${product.badge}</span>

            <div class="product-visual ${product.category}">

                <div class="product-can ${product.category}">
                    <div class="can-logo"></div>
                    <strong>pepsi</strong>
                </div>

            </div>

            <div class="product-info">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-bottom">

                    <span class="product-price">
                        S/ ${product.price.toFixed(2)}
                    </span>

                    <button class="add-cart"
                        onclick="addToCart(${product.id})"
                        aria-label="Agregar ${product.name} al carrito">

                        <i class="fa-solid fa-plus"></i>

                    </button>

                </div>

            </div>

        </article>

    `).join("");
}

// =====================================
// 4. FILTRAR PRODUCTOS
// =====================================

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter-btn")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        activeFilter = button.dataset.filter;

        document.querySelectorAll(".category-card")
            .forEach(card => card.classList.remove("selected"));

        renderProducts();

    });

});

// Filtros desde las tarjetas de categorías

document.querySelectorAll(".category-card").forEach(button => {

    button.addEventListener("click", () => {

        activeFilter = button.dataset.filter;

        document.querySelectorAll(".filter-btn")
            .forEach(btn => {
                btn.classList.toggle(
                    "active",
                    btn.dataset.filter === activeFilter
                );
            });

        document.querySelectorAll(".category-card")
            .forEach(card => card.classList.remove("selected"));

        button.classList.add("selected");

        renderProducts();

        document.getElementById("productos").scrollIntoView({
            behavior: "smooth"
        });

    });

});

// =====================================
// 5. ORDENAR PRODUCTOS
// =====================================

document.getElementById("sortProducts")
    .addEventListener("change", renderProducts);

// =====================================
// 6. BUSCADOR
// =====================================

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");

document.getElementById("searchBtn").addEventListener("click", () => {
    searchPanel.classList.add("open");
    searchInput.focus();
});

document.getElementById("closeSearch").addEventListener("click", () => {
    searchPanel.classList.remove("open");
    searchInput.value = "";
    searchText = "";
    renderProducts();
});

searchInput.addEventListener("input", event => {

    searchText = event.target.value.toLowerCase().trim();

    activeFilter = "todos";

    document.querySelectorAll(".filter-btn")
        .forEach(btn => {
            btn.classList.toggle(
                "active",
                btn.dataset.filter === "todos"
            );
        });

    renderProducts();

});

// =====================================
// 7. AGREGAR AL CARRITO
// =====================================

function addToCart(id) {

    const product = products.find(item => item.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();

    showToast(`${product.name} agregado al carrito`);

}

// =====================================
// 8. ELIMINAR DEL CARRITO
// =====================================

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();

    showToast("Producto eliminado");

}

// =====================================
// 9. ACTUALIZAR CARRITO
// =====================================

function updateCart() {

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {

        totalItems += item.quantity;

        totalPrice += item.price * item.quantity;

    });

    cartCount.textContent = totalItems;

    cartTotal.textContent = `S/ ${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {

        cartItems.innerHTML =
            `<p class="empty-cart">Tu carrito está vacío.</p>`;

        return;
    }

    cartItems.innerHTML = cart.map(item => `

        <div class="cart-item">

            <div>

                <h4>${item.name}</h4>

                <p>
                    ${item.quantity} x S/ ${item.price.toFixed(2)}
                </p>

            </div>

            <button onclick="removeFromCart(${item.id})"
                aria-label="Eliminar ${item.name}">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `).join("");

}

// =====================================
// 10. ABRIR Y CERRAR CARRITO
// =====================================

function openCart() {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
}

function closeCart() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
}

document.getElementById("cartBtn").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);

// =====================================
// 11. FINALIZAR PEDIDO
// =====================================

document.getElementById("checkoutBtn").addEventListener("click", () => {

    if (cart.length === 0) {
        showToast("Agrega productos antes de continuar.");
        return;
    }

    showToast("¡Pedido de demostración registrado!");

    cart = [];

    updateCart();

    closeCart();

});

// =====================================
// 12. MENSAJES
// =====================================

let toastTimer;

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}

// =====================================
// 13. FORMULARIO DE SUSCRIPCIÓN
// =====================================

document.getElementById("newsletterForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        const email = document.getElementById("emailInput").value;

        if (!email.trim()) return;

        showToast("¡Gracias por suscribirte!");

        event.target.reset();

    });

// =====================================
// 14. MENÚ PARA CELULARES
// =====================================

document.getElementById("menuToggle")
    .addEventListener("click", () => {

        document.querySelector(".nav-links")
            .classList.toggle("show");

    });

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {
        document.querySelector(".nav-links")
            .classList.remove("show");
    });

});

// =====================================
// 15. INICIAR PÁGINA
// =====================================

renderProducts();
updateCart();
