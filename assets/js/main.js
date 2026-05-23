const WHATSAPP_NUMBER = "5511992698998";

const products = [
  {
    id: "pano-sao-jose",
    name: "Pano protetor com estampa de São José",
    category: "Panos protetores",
    description: "Capa de Missal em tecido, pensada para proteger o livro durante o uso e o transporte.",
    price: 38,
    image: "img templates/pano-missal.png",
    status: "available",
    featured: true,
    tags: ["Missal", "Tecido", "São José"]
  },
  {
    id: "cordao-sao-jose",
    name: "Cordão de São José",
    category: "Cordões",
    description: "Cordão devocional simples para uso cotidiano, com referência a São José.",
    price: 18,
    image: "img templates/cordao.png",
    status: "available",
    featured: true,
    tags: ["Devocao", "Uso diario"]
  },
  {
    id: "terco-sao-jose",
    name: "Terço de São José",
    category: "Terços",
    description: "Terço dedicado a São José, com acabamento sóbrio e apropriado para presente.",
    price: 42,
    image: "img templates/terco.png",
    status: "available",
    featured: true,
    tags: ["Oracao", "Presente"]
  },
  {
    id: "capinha-terco",
    name: "Capinha protetora de terço",
    category: "Capinhas",
    description: "Estojo pequeno para guardar e proteger o terço na bolsa, mochila ou bolso.",
    price: 22,
    image: "img templates/capinha.png",
    status: "available",
    featured: false,
    tags: ["Protecao", "Acessorio"]
  },
  {
    id: "caneca-sao-jose",
    name: "Caneca de São José",
    category: "Canecas",
    description: "Caneca temática de São José para casa, escritório ou eventos da associação.",
    price: 35,
    image: "img templates/caneca.png",
    status: "available",
    featured: false,
    tags: ["Casa", "Presente"]
  },
  {
    id: "quadro-sao-jose",
    name: "Quadro de São José",
    category: "Quadros",
    description: "Quadro devocional para oratório, sala, escritório ou quarto.",
    price: 85,
    image: "img templates/quadro.png",
    status: "consult",
    featured: false,
    tags: ["Oratorio", "Decoracao"]
  },
  {
    id: "ima-sao-jose",
    name: "Ímã de São José",
    category: "Ímãs",
    description: "Ímã pequeno com tema de São José para lembrança, geladeira ou quadro metálico.",
    price: 12,
    image: "img templates/ima.png",
    status: "available",
    featured: false,
    tags: ["Lembranca", "Pequeno"]
  }
];

const statusLabels = {
  available: "Disponível",
  soldout: "Esgotado",
  consult: "Sob consulta"
};

let cart = [];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const advancedSearchInput = document.getElementById("advanced-search-input");
const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");
const sortSelect = document.getElementById("sort-select");
const clearFilters = document.getElementById("clear-filters");
const resultsMeta = document.getElementById("results-meta");
const filterDrawer = document.getElementById("filter-drawer");
const filterBackdrop = document.getElementById("filter-backdrop");
const openFiltersButton = document.getElementById("open-filters");
const openFiltersMenuButton = document.getElementById("open-filters-menu");
const closeFiltersButton = document.getElementById("close-filters");
const applyFiltersButton = document.getElementById("apply-filters");
const cartDrawer = document.getElementById("cart-drawer");
const cartBackdrop = document.getElementById("cart-backdrop");
const openCartButton = document.getElementById("open-cart");
const closeCartButton = document.getElementById("close-cart");
const cartCount = document.getElementById("cart-count");
const cartCountMobile = document.getElementById("cart-count-mobile");
const openCartMobileButton = document.getElementById("open-cart-mobile");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-whatsapp");
const orderNote = document.getElementById("order-note");

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function setupCategories() {
  const categories = ["Todas", ...new Set(products.map((product) => product.category))];
  categoryFilter.innerHTML = categories
    .map((category) => `<option value="${category === "Todas" ? "all" : category}">${category}</option>`)
    .join("");
}

function productMatchesFilters(product) {
  const query = normalizeText(searchInput.value.trim() || advancedSearchInput.value.trim());
  const category = categoryFilter.value;
  const price = priceFilter.value;
  const searchableText = [
    product.name,
    product.category,
    product.description,
    product.id,
    ...product.tags
  ].join(" ");
  const searchable = normalizeText(searchableText);

  if (query && !searchable.includes(query)) {
    return false;
  }

  if (category !== "all" && product.category !== category) {
    return false;
  }

  if (price !== "all") {
    const [min, max] = price.split("-").map(Number);
    if (product.price < min || product.price > max) {
      return false;
    }
  }

  return true;
}

function sortProducts(list) {
  const sorted = [...list];

  sorted.sort((a, b) => {
    if (sortSelect.value === "name-asc") {
      return a.name.localeCompare(b.name, "pt-BR");
    }

    if (sortSelect.value === "price-asc") {
      return a.price - b.price;
    }

    if (sortSelect.value === "price-desc") {
      return b.price - a.price;
    }

    if (sortSelect.value === "available") {
      return Number(b.status === "available") - Number(a.status === "available");
    }

    return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name, "pt-BR");
  });

  return sorted;
}

function renderProducts() {
  const filteredProducts = sortProducts(products.filter(productMatchesFilters));

  resultsMeta.textContent = `${filteredProducts.length} de ${products.length} produtos`;

  if (!filteredProducts.length) {
    productGrid.innerHTML = `<div class="empty-state">Nenhum produto encontrado.</div>`;
    return;
  }

  productGrid.innerHTML = filteredProducts.map((product) => {
    const disabled = product.status !== "available";
    const statusClass = product.status;
    const cardClass = disabled ? "product-card unavailable" : "product-card";
    const buttonLabel = product.status === "consult" ? "Consultar" : "Adicionar";
    const buttonDisabled = product.status === "soldout" ? "disabled" : "";

    return `
      <article class="${cardClass}">
        <div class="product-media">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-body">
          <p class="product-category">${product.category}</p>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-tags">
            ${product.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <span class="status ${statusClass}">${statusLabels[product.status]}</span>
          <div class="product-footer">
            <span class="price">${formatCurrency(product.price)}</span>
            <button class="add-button" type="button" data-product-id="${product.id}" ${buttonDisabled}>${buttonLabel}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product || product.status === "soldout") {
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  renderCart();

  if (window.innerWidth <= 620) {
    showAddAnimation(product);
  } else {
    openCart();
  }
}

function showAddAnimation(product) {
  const container = document.getElementById("add-animation-container");
  if (!container) return;

  const popup = document.createElement("div");
  popup.className = "add-popup";
  popup.innerHTML = `
    <img src="${product.image.replace("../", "")}" alt="">
    <span>+1</span>
  `;

  container.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1400);
}

function updateQuantity(productId, delta) {
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) {
    return;
  }

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function getCartTotals() {
  return cart.reduce((totals, item) => {
    totals.quantity += item.quantity;
    totals.value += item.price * item.quantity;
    return totals;
  }, { quantity: 0, value: 0 });
}

function renderCart() {
  const totals = getCartTotals();
  const isCartOpen = cartDrawer.classList.contains("open");

  cartCount.textContent = totals.quantity;
  if (cartCountMobile) cartCountMobile.textContent = totals.quantity;
  cartTotal.textContent = formatCurrency(totals.value);

  // Show/Hide floating cart on mobile
  if (openCartMobileButton) {
    if (totals.quantity > 0 && !isCartOpen) {
      openCartMobileButton.hidden = false;
      openCartMobileButton.style.display = "flex";
    } else {
      openCartMobileButton.hidden = true;
      openCartMobileButton.style.display = "none";
    }
  }

  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-state">Carrinho vazio.</div>`;
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div>
        <h3>${item.name}</h3>
        <p>${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.quantity * item.price)}</p>
        <button class="remove-button" type="button" data-remove-id="${item.id}">Remover</button>
      </div>
      <div class="cart-actions" aria-label="Quantidade de ${item.name}">
        <button class="qty-button" type="button" data-qty-id="${item.id}" data-delta="-1">-</button>
        <strong>${item.quantity}</strong>
        <button class="qty-button" type="button" data-qty-id="${item.id}" data-delta="1">+</button>
      </div>
    </div>
  `).join("");
}

function openCart() {
  if (openCartMobileButton) openCartMobileButton.style.display = "none";
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartBackdrop.hidden = false;
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartBackdrop.hidden = true;
  renderCart();
}

function openFilters() {
  if (typeof closeMenu === "function") closeMenu();
  advancedSearchInput.value = searchInput.value;
  filterDrawer.classList.add("open");
  filterDrawer.setAttribute("aria-hidden", "false");
  filterBackdrop.hidden = false;
}

function closeFilters() {
  filterDrawer.classList.remove("open");
  filterDrawer.setAttribute("aria-hidden", "true");
  filterBackdrop.hidden = true;
}

function checkoutWhatsApp() {
  if (!cart.length) {
    alert("Adicione algum produto ao carrinho antes de finalizar.");
    return;
  }

  const totals = getCartTotals();
  const lines = cart.map((item) => {
    return `- ${item.quantity}x ${item.name} (${formatCurrency(item.price)} cada) = ${formatCurrency(item.quantity * item.price)}`;
  });
  const note = orderNote.value.trim();
  const message = [
    "Salve Maria! Gostaria de fazer um pedido na Vendinha da ASJ:",
    "",
    ...lines,
    "",
    `Total: ${formatCurrency(totals.value)}`,
    note ? `Observação: ${note}` : ""
  ].filter(Boolean).join("\n");
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener");
}

function clearAllFilters() {
  searchInput.value = "";
  advancedSearchInput.value = "";
  categoryFilter.value = "all";
  priceFilter.value = "all";
  sortSelect.value = "featured";
  renderProducts();
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (button) {
    addToCart(button.dataset.productId);
  }
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-qty-id]");
  const removeButton = event.target.closest("[data-remove-id]");

  if (quantityButton) {
    updateQuantity(quantityButton.dataset.qtyId, Number(quantityButton.dataset.delta));
  }

  if (removeButton) {
    removeFromCart(removeButton.dataset.removeId);
  }
});

[searchInput, advancedSearchInput, categoryFilter, priceFilter, sortSelect].forEach((control) => {
  control.addEventListener("input", renderProducts);
  control.addEventListener("change", renderProducts);
});

searchInput.addEventListener("input", () => {
  advancedSearchInput.value = searchInput.value;
});

advancedSearchInput.addEventListener("input", () => {
  searchInput.value = advancedSearchInput.value;
});

clearFilters.addEventListener("click", clearAllFilters);
openFiltersButton?.addEventListener("click", openFilters);
openFiltersMenuButton?.addEventListener("click", openFilters);
closeFiltersButton.addEventListener("click", closeFilters);
filterBackdrop.addEventListener("click", closeFilters);
applyFiltersButton.addEventListener("click", closeFilters);
openCartButton.addEventListener("click", openCart);
openCartMobileButton?.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
checkoutButton.addEventListener("click", checkoutWhatsApp);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeFilters();
  }
});

setupCategories();
renderProducts();
renderCart();
