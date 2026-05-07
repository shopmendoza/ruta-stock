// Variables globales
let cart = [];
let currentFilter = 'all';
let currentLocation = null;
let productQuantities = {};

// Elementos del DOM
const elements = {
    searchInput: document.getElementById('searchInput'),
    cartBtn: document.getElementById('cartBtn'),
    cartCount: document.getElementById('cartCount'),
    cartModal: document.getElementById('cartModal'),
    checkoutModal: document.getElementById('checkoutModal'),
    loading: document.getElementById('loading'),
    categoriesGrid: document.getElementById('categoriesGrid'),
    productsGrid: document.getElementById('productsGrid'),
    filterButtons: document.getElementById('filterButtons'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle')
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    applyResponsiveSectionOrder();
    setupEventListeners();
    loadCategories();
    loadFilterButtons();
    loadProducts();
    updateCartUI();

    // Si cambia entre móvil/escritorio, mantenemos el orden correcto.
    window.addEventListener('resize', applyResponsiveSectionOrder);
});

function applyResponsiveSectionOrder() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const productsSection = document.getElementById('productos');
    const categoriesSection = document.getElementById('categorias');
    if (!productsSection || !categoriesSection) return;

    if (isMobile) {
        // En móvil mostramos productos antes que categorías para reducir fricción.
        if (categoriesSection.previousElementSibling !== productsSection) {
            categoriesSection.parentNode.insertBefore(productsSection, categoriesSection);
        }
    } else {
        // En escritorio restauramos categorías antes de productos.
        if (productsSection.previousElementSibling !== categoriesSection) {
            productsSection.parentNode.insertBefore(categoriesSection, productsSection);
        }
    }
}

// Inicializar aplicación
function initializeApp() {
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('rutastock_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    // Configurar scroll suave para navegación
    setupSmoothScroll();
    
    // Configurar header scroll effect
    setupHeaderScrollEffect();
}

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
    }

    // Click en lupita: llevar a productos y enfocar búsqueda
    document.getElementById('searchBtn')?.addEventListener('click', () => {
        scrollToSection('productos');
        setTimeout(() => elements.searchInput?.focus(), 250);
        const q = elements.searchInput?.value?.trim();
        if (q) scrollToFirstSearchedProduct(q);
    });

    // Carrito
    if (elements.cartBtn) {
        elements.cartBtn.addEventListener('click', openCartModal);
    }

    // Filtros: se generan dinámicamente en `loadFilterButtons()`

    // Modales
    setupModalEventListeners();

    // Navegación móvil
    if (elements.mobileMenuToggle) {
        elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Navegación
    setupNavigation();
}

// Generar botones de filtro según categorías existentes
function loadFilterButtons() {
    if (!elements.filterButtons) return;

    // Mostrar solo categorías que tengan productos
    const categoriesWithProducts = categoriesData.filter(c => c.count > 0);

    elements.filterButtons.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.setAttribute('data-category', 'all');
    allBtn.textContent = 'Todos';
    allBtn.addEventListener('click', handleCategoryFilter);
    elements.filterButtons.appendChild(allBtn);

    categoriesWithProducts.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-category', category.id);
        btn.textContent = category.name;
        btn.addEventListener('click', handleCategoryFilter);
        elements.filterButtons.appendChild(btn);
    });
}

// Configurar navegación suave
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            // Si van a "Productos", limpiamos una búsqueda previa para evitar lista vacía.
            if (targetId === 'productos') {
                if (elements.searchInput) {
                    elements.searchInput.value = '';
                }
                currentFilter = 'all';
                updateFilterButtons();
                loadProducts(getProductsByCategory('all'));
            }

            scrollToSection(targetId);
            
            // Actualizar navegación activa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // En móvil, cerrar menú al seleccionar una sección.
            closeMobileMenu();
        });
    });
}

// Configurar efecto de scroll en header
function setupHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(13, 13, 13, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(13, 13, 13, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScrollY = currentScrollY;
    });
}

// Configurar navegación
function setupNavigation() {
    // Detectar sección activa en scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Cargar categorías
function loadCategories() {
    if (!elements.categoriesGrid) return;

    elements.categoriesGrid.innerHTML = '';
    
    categoriesData.forEach(category => {
        const categoryCard = createCategoryCard(category);
        elements.categoriesGrid.appendChild(categoryCard);
    });
}

// Crear card de categoría
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.setAttribute('data-category', category.id);
    
    card.innerHTML = `
        <i class="${category.icon}"></i>
        <h3>${category.name}</h3>
        <p>${category.description}</p>
        <small>${category.count} productos</small>
    `;

    card.addEventListener('click', () => {
        scrollToSection('productos');
        setTimeout(() => {
            filterProducts(category.id);
        }, 500);
    });

    return card;
}

// Cargar productos
function loadProducts(products = null) {
    if (!elements.productsGrid) return;

    showLoading();
    
    setTimeout(() => {
        const productsToShow = products || getProductsByCategory(currentFilter);
        elements.productsGrid.innerHTML = '';
        
        if (productsToShow.length === 0) {
            elements.productsGrid.innerHTML = `
                <div class="empty-products">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-secondary);">No se encontraron productos</p>
                </div>
            `;
        } else {
            productsToShow.forEach(product => {
                const productCard = createProductCard(product);
                elements.productsGrid.appendChild(productCard);
            });
        }
        
        hideLoading();
    }, 300);
}

// Crear card de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    const imageContent = product.image 
        ? `<img src="${product.image}" alt="${product.name}">`
        : `<i class="${product.icon}"></i>`;

    const initialQty = getSelectedProductQty(product.id);

    card.innerHTML = `
        <div class="product-image">
            ${imageContent}
        </div>
        <div class="product-info">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">${appConfig.currency}${product.price}</span>
                <div class="qty-selector" aria-label="Seleccionar cantidad">
                    <button class="qty-btn" type="button" onclick="decrementProductQty(${product.id})" aria-label="Restar">−</button>
                    <span class="qty-value" id="qty-${product.id}" aria-label="Cantidad">${initialQty}</span>
                    <button class="qty-btn" type="button" onclick="incrementProductQty(${product.id})" aria-label="Sumar">+</button>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id}, getSelectedProductQty(${product.id}))">
                    <i class="fas fa-cart-plus"></i>
                    Agregar
                </button>
            </div>
        </div>
    `;

    return card;
}

function getSelectedProductQty(productId) {
    if (!productQuantities[productId]) productQuantities[productId] = 1;
    return productQuantities[productId];
}

function setSelectedProductQty(productId, qty) {
    const safeQty = Math.max(1, Math.min(99, qty));
    productQuantities[productId] = safeQty;
    const qtyEl = document.getElementById(`qty-${productId}`);
    if (qtyEl) qtyEl.textContent = String(safeQty);
}

function incrementProductQty(productId) {
    setSelectedProductQty(productId, getSelectedProductQty(productId) + 1);
}

function decrementProductQty(productId) {
    setSelectedProductQty(productId, getSelectedProductQty(productId) - 1);
}

// Obtener nombre de categoría
function getCategoryName(categoryId) {
    const category = categoriesData.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
}

// Manejar búsqueda
function handleSearch(e) {
    const query = e.target.value;
    const results = searchProducts(query);
    loadProducts(results);
    
    // Resetear filtro activo
    currentFilter = 'all';
    updateFilterButtons();

    // Si hay búsqueda, bajar a productos y resaltar el primer resultado
    if (query && query.trim().length > 0) {
        scrollToSection('productos');
        scrollToFirstSearchedProduct(query);
    }
}

function scrollToFirstSearchedProduct(query) {
    const results = searchProducts(query);
    if (!results || results.length === 0) return;

    const firstId = results[0].id;
    setTimeout(() => {
        const card = document.querySelector(`[data-product-id="${firstId}"]`);
        if (!card) return;

        card.scrollIntoView({ behavior: 'smooth', block: 'center' });

        card.classList.add('product-highlight');
        setTimeout(() => card.classList.remove('product-highlight'), 1600);
    }, 350);
}

// Manejar filtro de categoría
function handleCategoryFilter(e) {
    const category = e.target.getAttribute('data-category');
    filterProducts(category);
}

// Filtrar productos
function filterProducts(category) {
    currentFilter = category;
    updateFilterButtons();
    
    // Limpiar búsqueda
    if (elements.searchInput) {
        elements.searchInput.value = '';
    }
    
    const products = getProductsByCategory(category);
    loadProducts(products);
}

// Actualizar botones de filtro
function updateFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === currentFilter) {
            btn.classList.add('active');
        }
    });
}

// Agregar al carrito
function addToCart(productId, quantityToAdd = 1) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += Math.max(1, quantityToAdd);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            icon: product.icon,
            quantity: Math.max(1, quantityToAdd)
        });
    }

    saveCart();
    updateCartUI();
    showAddToCartAnimation(productId);
    showCartNotification(product.name, quantityToAdd);
}

// Remover del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    updateCartModal();
}

// Actualizar cantidad en carrito
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
        updateCartModal();
    }
}

// Limpiar carrito
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
    updateCartModal();
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('rutastock_cart', JSON.stringify(cart));
}

// Actualizar UI del carrito
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (elements.cartCount) {
        elements.cartCount.textContent = totalItems;
        elements.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    if (elements.cartTotal) {
        elements.cartTotal.textContent = totalAmount;
    }
}

// Mostrar animación de agregar al carrito
function showAddToCartAnimation(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (!productCard) return;

    const button = productCard.querySelector('.add-to-cart');
    const originalText = button.innerHTML;
    const cartButton = document.getElementById('cartBtn');
    
    button.innerHTML = '<i class="fas fa-check"></i> Agregado';
    button.style.background = '#4CAF50';

    // Señal clara para que el usuario vea dónde finalizar pedido.
    if (cartButton) {
        cartButton.classList.remove('cart-attention');
        void cartButton.offsetWidth;
        cartButton.classList.add('cart-attention');
    }
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 1000);
}

function showCartNotification(productName, qty) {
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${qty > 1 ? `${qty}x ${productName}` : productName} agregado al carrito</span>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
    }, 1800);
}

// Configurar event listeners de modales
function setupModalEventListeners() {
    // Cerrar modales
    document.getElementById('closeCartModal')?.addEventListener('click', closeCartModal);
    document.getElementById('closeCheckoutModal')?.addEventListener('click', closeCheckoutModal);
    
    // Acciones del carrito
    document.getElementById('clearCart')?.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            clearCart();
        }
    });
    
    document.getElementById('checkoutBtn')?.addEventListener('click', openCheckoutModal);
    
    // Acciones del checkout
    document.getElementById('cancelCheckout')?.addEventListener('click', closeCheckoutModal);
    document.getElementById('sendOrderBtn')?.addEventListener('click', sendWhatsAppOrder);

    // Cerrar modal al hacer click fuera
    elements.cartModal?.addEventListener('click', (e) => {
        if (e.target === elements.cartModal) closeCartModal();
    });

    const cartModalContent = elements.cartModal?.querySelector('.modal-content');
    cartModalContent?.addEventListener('scroll', updateCartScrollHint);
    
    elements.checkoutModal?.addEventListener('click', (e) => {
        if (e.target === elements.checkoutModal) closeCheckoutModal();
    });
}

// Abrir modal del carrito
function openCartModal() {
    if (!elements.cartModal) return;
    
    updateCartModal();
    elements.cartModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    const cartModalContent = elements.cartModal.querySelector('.modal-content');
    if (cartModalContent) cartModalContent.scrollTop = 0;
    setTimeout(updateCartScrollHint, 100);
}

// Cerrar modal del carrito
function closeCartModal() {
    if (!elements.cartModal) return;
    
    elements.cartModal.classList.remove('show');
    document.body.style.overflow = '';
    document.getElementById('cartScrollHint')?.classList.remove('show');
}

// Actualizar contenido del modal del carrito
function updateCartModal() {
    if (!elements.cartItems) return;

    if (cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <p>Tu carrito está vacío</p>
                <button class="btn btn-primary" onclick="closeCartModal(); scrollToSection('productos');">
                    <i class="fas fa-shopping-bag"></i>
                    Ver Productos
                </button>
            </div>
        `;
        updateCartScrollHint();
        return;
    }

    elements.cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${appConfig.currency}${item.price}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="remove-item" onclick="removeFromCart(${item.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    updateCartScrollHint();
}

function updateCartScrollHint() {
    if (!elements.cartModal) return;

    const hint = document.getElementById('cartScrollHint');
    const cartModalContent = elements.cartModal.querySelector('.modal-content');
    if (!hint || !cartModalContent) return;

    const canScroll = cartModalContent.scrollHeight - cartModalContent.clientHeight > 30;
    const nearBottom = cartModalContent.scrollTop + cartModalContent.clientHeight >= cartModalContent.scrollHeight - 24;
    const shouldShow = elements.cartModal.classList.contains('show') && cart.length > 0 && canScroll && !nearBottom;

    hint.classList.toggle('show', shouldShow);
}

// Abrir modal de checkout
function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    closeCartModal();
    
    if (elements.checkoutModal) {
        elements.checkoutModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Cerrar modal de checkout
function closeCheckoutModal() {
    if (!elements.checkoutModal) return;
    
    elements.checkoutModal.classList.remove('show');
    document.body.style.overflow = '';
}

// (Se eliminó "Obtener mi ubicación" del checkout)

// Enviar pedido por WhatsApp
function sendWhatsAppOrder() {
    const customerName = document.getElementById('customerName')?.value.trim();
    const customerAddress = document.getElementById('customerAddress')?.value.trim();
    const customerReference = document.getElementById('customerReference')?.value.trim();

    if (!customerName || !customerAddress) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }

    const orderMessage = generateOrderMessage(customerName, customerAddress, customerReference);
    const whatsappUrl = `https://wa.me/${whatsappConfig.phoneNumber}?text=${encodeURIComponent(orderMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Limpiar carrito después de enviar
    clearCart();
    closeCheckoutModal();
    
    // Mostrar mensaje de confirmación
    showOrderConfirmation();
}

// Generar mensaje de pedido
function generateOrderMessage(name, address, reference) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let message = `🛒 *NUEVO PEDIDO - RUTA STOCK*\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📍 *Dirección:* ${address}\n`;
    
    if (reference) {
        message += `📝 *Referencia:* ${reference}\n`;
    }
    
    if (currentLocation) {
        message += `🗺️ *Ubicación GPS:* https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}\n`;
    }
    
    message += `\n📦 *PRODUCTOS:*\n`;
    message += `${'─'.repeat(30)}\n`;
    
    cart.forEach(item => {
        message += `• ${item.name}\n`;
        message += `  Cantidad: ${item.quantity}\n`;
        message += `  Precio: $${item.price} c/u\n`;
        message += `  Subtotal: $${item.price * item.quantity}\n\n`;
    });
    
    message += `${'─'.repeat(30)}\n`;
    message += `💰 *TOTAL: $${total}*\n\n`;
    message += `⏰ Pedido realizado: ${new Date().toLocaleString('es-AR')}\n\n`;
    message += `¡Gracias por elegir Ruta Stock! 🚚`;

    return message;
}

// Mostrar confirmación de pedido
function showOrderConfirmation() {
    const confirmation = document.createElement('div');
    confirmation.className = 'order-confirmation';
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <i class="fas fa-check-circle"></i>
            <h3>¡Pedido enviado!</h3>
            <p>Tu pedido ha sido enviado por WhatsApp. Te contactaremos pronto para confirmar la entrega.</p>
        </div>
    `;
    
    confirmation.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = confirmation.querySelector('.confirmation-content');
    content.style.cssText = `
        background: var(--background-light);
        border: 1px solid var(--border-color);
        border-radius: 15px;
        padding: 3rem;
        text-align: center;
        max-width: 400px;
        animation: slideUp 0.3s ease;
    `;
    
    const icon = content.querySelector('i');
    icon.style.cssText = `
        font-size: 4rem;
        color: #4CAF50;
        margin-bottom: 1rem;
    `;
    
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.remove();
    }, 3000);
}

// Abrir WhatsApp para contacto general
function openWhatsApp() {
    const message = whatsappConfig.message;
    const whatsappUrl = `https://wa.me/${whatsappConfig.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Scroll a sección
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Toggle menú móvil
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const isVisible = nav.style.display === 'flex';
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 70;
    
    if (isVisible) {
        closeMobileMenu();
    } else {
        nav.style.display = 'flex';
        nav.style.position = 'fixed';
        nav.style.top = `${headerHeight}px`;
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'var(--background-dark)';
        nav.style.flexDirection = 'column';
        nav.style.padding = '2rem';
        nav.style.borderTop = '1px solid var(--border-color)';
        nav.style.zIndex = '999';
    }
}

function closeMobileMenu() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    nav.style.display = 'none';
}

// Mostrar loading
function showLoading() {
    if (elements.loading) {
        elements.loading.classList.add('show');
    }
}

// Ocultar loading
function hideLoading() {
    if (elements.loading) {
        elements.loading.classList.remove('show');
    }
}

// Utilidades
function formatPrice(price) {
    return `${appConfig.currency}${price.toLocaleString('es-AR')}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar búsqueda con debounce
if (elements.searchInput) {
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
}

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    hideLoading();
});

// Exportar funciones globales para uso en HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.openWhatsApp = openWhatsApp;
window.scrollToSection = scrollToSection;
window.toggleMobileMenu = toggleMobileMenu;
window.incrementProductQty = incrementProductQty;
window.decrementProductQty = decrementProductQty;
window.getSelectedProductQty = getSelectedProductQty;