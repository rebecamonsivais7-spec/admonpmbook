const productos = [
  {
    id: "p1",
    nombre: "Vestido blanco",
    categoria: "Vestidos",
    color: "blanco",
    precio: 400,
    descripcion: "Vestido corto blanco de hombros descubiertos",
    imagen: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "p2",
    nombre: "Vestido floreado",
    categoria: "Vestidos",
    color: "floreado",
    precio: 690,
    descripcion: "Vestido ligero con estampado floral",
    imagen: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "p3",
    nombre: "Blusa rosa",
    categoria: "Blusas",
    color: "blanco",
    precio: 380,
    descripcion: "Blusa clara de estilo clásico",
    imagen: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "p4",
    nombre: "Bolsa mini",
    categoria: "Bolsas",
    color: "negro",
    precio: 620,
    descripcion: "Bolsa elegante pequeña",
    imagen: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "p5",
    nombre: "Camisa blanca",
    categoria: "Camisas",
    color: "blanco",
    precio: 450,
    descripcion: "Camisa blanca de lino",
    imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop"
  }
];

let carrito = [];
let categoriaActiva = "Todas";
let terminoBusqueda = "";

const categoriesEl = document.getElementById("categories");
const productGridEl = document.getElementById("productGrid");
const cartContentEl = document.getElementById("cartContent");
const cartPanelEl = document.getElementById("cartPanel");
const cartToggleEl = document.getElementById("cartToggle");
const closeCartBtnEl = document.getElementById("closeCartBtn");
const searchToggleEl = document.getElementById("searchToggle");
const searchBoxEl = document.getElementById("searchBox");
const searchInputEl = document.getElementById("searchInput");
const clearSearchBtnEl = document.getElementById("clearSearchBtn");
const openChatBtnEl = document.getElementById("openChatBtn");
const closeChatBtnEl = document.getElementById("closeChatBtn");
const chatModalEl = document.getElementById("chatModal");
const chatMessagesEl = document.getElementById("chatMessages");
const chatInputEl = document.getElementById("chatInput");
const sendChatBtnEl = document.getElementById("sendChatBtn");
const menuBtnEl = document.getElementById("menuBtn");
const menuPanelEl = document.getElementById("menuPanel");
const closeMenuBtnEl = document.getElementById("closeMenuBtn");
const menuOpenCartEl = document.getElementById("menuOpenCart");
const menuOpenChatEl = document.getElementById("menuOpenChat");
const menuResetCatalogEl = document.getElementById("menuResetCatalog");

function getCategorias() {
  return ["Todas", ...new Set(productos.map(p => p.categoria))];
}

function limpiarBusqueda() {
  terminoBusqueda = "";
  searchInputEl.value = "";
  renderProductos();
}

function resetCatalogo() {
  categoriaActiva = "Todas";
  terminoBusqueda = "";
  searchInputEl.value = "";
  renderCategorias();
  renderProductos();
}

function renderCategorias() {
  categoriesEl.innerHTML = getCategorias().map(cat => `
    <button class="category-btn ${cat === categoriaActiva ? "active" : ""}" data-cat="${cat}">
      ${cat}
    </button>
  `).join("");

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;

      if (cat === "Todas") {
        resetCatalogo();
        return;
      }

      categoriaActiva = cat;
      renderCategorias();
      renderProductos();
    });
  });
}

function obtenerProductosFiltrados() {
  return productos.filter(prod => {
    const coincideCategoria =
      categoriaActiva === "Todas" || prod.categoria === categoriaActiva;

    const texto = `${prod.nombre} ${prod.categoria} ${prod.color} ${prod.descripcion}`.toLowerCase();
    const coincideBusqueda = texto.includes(terminoBusqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });
}

function renderProductos() {
  const filtrados = obtenerProductosFiltrados();

  if (filtrados.length === 0) {
    productGridEl.innerHTML = `
      <p style="grid-column: 1 / -1; text-align:center; padding: 40px; color:#7b736c;">
        No se encontraron productos.
      </p>
    `;
    return;
  }

  productGridEl.innerHTML = filtrados.map(prod => `
    <article class="card">
      <div class="product-image">
        <img src="${prod.imagen}" alt="${prod.nombre}">
      </div>
      <button class="add-btn" data-id="${prod.id}">+</button>
      <div class="card-info">
        <div class="card-title">${prod.nombre}</div>
        <div class="card-price">$${prod.precio}</div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      agregarAlCarrito(btn.dataset.id);
    });
  });
}

function agregarAlCarrito(id) {
  const existente = carrito.find(item => item.id === id);

  if (existente) {
    existente.qty += 1;
  } else {
    const producto = productos.find(p => p.id === id);
    carrito.push({ ...producto, qty: 1 });
  }

  renderCarrito();
  abrirBolsa();
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  if (!item) return;

  item.qty += cambio;

  if (item.qty <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }

  renderCarrito();
}

function renderCarrito() {
  if (carrito.length === 0) {
    cartContentEl.innerHTML = `<div class="cart-empty">Tu bolsa está vacía</div>`;
    return;
  }

  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.qty, 0);

  cartContentEl.innerHTML = `
    <div>
      <div class="cart-items">
        ${carrito.map(item => `
          <div class="cart-item">
            <div class="cart-thumb">
              <img src="${item.imagen}" alt="${item.nombre}">
            </div>
            <div>
              <h4>${item.nombre}</h4>
              <p>${item.descripcion}</p>
              <div class="qty">
                <button class="qty-btn" data-id="${item.id}" data-change="-1">−</button>
                <span>${item.qty}</span>
                <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
              </div>
            </div>
            <div class="cart-price">$${item.precio * item.qty}</div>
          </div>
        `).join("")}
      </div>

      <div class="summary">
        <div class="summary-lines">
          <div>Subtotal: $${subtotal}</div>
          <div>Descuentos: $0</div>
          <div class="summary-total">Total: $${subtotal}</div>
        </div>
        <button class="checkout-btn">Finalizar compra</button>
      </div>
    </div>
  `;

  document.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      cambiarCantidad(btn.dataset.id, Number(btn.dataset.change));
    });
  });
}

function abrirBolsa() {
  cartPanelEl.classList.remove("hidden");
}

function cerrarBolsa() {
  cartPanelEl.classList.add("hidden");
}

function abrirMenu() {
  menuPanelEl.classList.remove("hidden");
}

function cerrarMenu() {
  menuPanelEl.classList.add("hidden");
}

function agregarMensajeChat(texto, tipo) {
  const div = document.createElement("div");
  div.className = tipo === "user" ? "user-message" : "bot-message";
  div.textContent = texto;
  chatMessagesEl.appendChild(div);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

async function responderChatIA(mensaje) {
  try {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: mensaje,
        productos
      })
    });

    const data = await res.json();

    if (data.action === "reset_catalog") {
      resetCatalogo();
    }

    if (data.action === "open_cart") {
      abrirBolsa();
    }

    if (data.action === "close_cart") {
      cerrarBolsa();
    }

    if (data.filters?.search !== undefined) {
      terminoBusqueda = data.filters.search || "";
      searchInputEl.value = terminoBusqueda;
    }

    if (data.filters?.category !== undefined) {
      categoriaActiva = data.filters.category || "Todas";
    }

    renderCategorias();
    renderProductos();

    agregarMensajeChat(data.reply || "No recibí respuesta del asistente.", "bot");
  } catch (error) {
    agregarMensajeChat("No pude conectar con el asistente en este momento.", "bot");
  }
}

function enviarChat() {
  const mensaje = chatInputEl.value.trim();
  if (!mensaje) return;

  agregarMensajeChat(mensaje, "user");
  responderChatIA(mensaje);
  chatInputEl.value = "";
}

searchToggleEl.addEventListener("click", () => {
  searchBoxEl.classList.toggle("open");
  if (searchBoxEl.classList.contains("open")) {
    searchInputEl.focus();
  }
});

searchInputEl.addEventListener("input", (e) => {
  terminoBusqueda = e.target.value;
  renderProductos();
});

clearSearchBtnEl.addEventListener("click", () => {
  limpiarBusqueda();
});

cartToggleEl.addEventListener("click", abrirBolsa);
closeCartBtnEl.addEventListener("click", cerrarBolsa);

openChatBtnEl.addEventListener("click", () => {
  chatModalEl.classList.remove("hidden");
});

closeChatBtnEl.addEventListener("click", () => {
  chatModalEl.classList.add("hidden");
});

sendChatBtnEl.addEventListener("click", enviarChat);
chatInputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    enviarChat();
  }
});

menuBtnEl.addEventListener("click", abrirMenu);
closeMenuBtnEl.addEventListener("click", cerrarMenu);

menuOpenCartEl.addEventListener("click", () => {
  abrirBolsa();
  cerrarMenu();
});

menuOpenChatEl.addEventListener("click", () => {
  chatModalEl.classList.remove("hidden");
  cerrarMenu();
});

menuResetCatalogEl.addEventListener("click", () => {
  resetCatalogo();
  cerrarMenu();
});

document.querySelectorAll(".menu-link").forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.menuCat;

    if (cat === "Todas") {
      resetCatalogo();
    } else {
      categoriaActiva = cat;
      terminoBusqueda = "";
      searchInputEl.value = "";
      renderCategorias();
      renderProductos();
    }

    cerrarMenu();
  });
});

renderCategorias();
renderProductos();
renderCarrito();
cerrarBolsa();