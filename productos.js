// =========================
// PRODUCTOS (EDITABLE ACÁ)
// =========================
// Tip: `price` debe ser número (sin $). Ej: 1500
// Tip: `image` es ruta local dentro de la carpeta `img/productos/` o un link.

const productsData = [
    {
        id: 1,
        name: "Huevos",
        category: "almacen",
        price: 6000,
        description: "Maple de 30 unidades de tamaño extra.",
        image: "img/productos/huevos.png",
        imageFit: "contain",
        icon: "fas fa-egg"
    },
    {
        id: 2,
        name: "Yerba",
        category: "almacen",
        price: 12000,
        description: "Yerba mate.",
        image: "img/productos/yerba.jpg",
        icon: "fas fa-leaf"
    },
    {
        id: 3,
        name: "Azúcar",
        category: "almacen",
        price: 0,
        description: "Azúcar común.",
        image: "img/productos/azucar.jpg",
        icon: "fas fa-cube"
    },
    {
        id: 4,
        name: "Papel Higiénico",
        category: "limpieza",
        price: 2000,
        description: "Papel higiénico pack.",
        image: null,
        icon: "fas fa-toilet-paper"
    },
    {
        id: 5,
        name: "Galleta Cofler",
        category: "snacks",
        price: 1200,
        description: "Galleta Cofler.",
        image: null,
        icon: "fas fa-cookie-bite"
    },
    {
        id: 6,
        name: "Maní Salado 100gr",
        category: "snacks",
        price: 1000,
        description: "Maní salado de 100 gramos.",
        image: null,
        icon: "fas fa-seedling"
    },
    {
        id: 7,
        name: "yerba cbs",
        category: "almacen",
        price: 1200,
        description: "Yerba cbs de 1 kilo.",
        image: null,
        icon: "fas fa-bottle-droplet"
    },
    {
        id: 8,
        name: "Papas Fritas 1kg",
        category: "snacks",
        price: 6700,
        description: "Papas fritas por kilo.",
        image: null,
        icon: "fas fa-cookie-bite"
    }
];

// =========================
// CATEGORÍAS (EDITABLE ACÁ)
// =========================
// Importante: `id` debe coincidir con el `category` de cada producto.
const categoriesData = [
    {
        id: "almacen",
        name: "Almacén",
        description: "Productos de despensa y primera necesidad",
        icon: "fas fa-box",
        count: 0
    },
    {
        id: "snacks",
        name: "Snacks",
        description: "Golosinas, galletitas y cosas ricas",
        icon: "fas fa-cookie-bite",
        count: 0
    },
    {
        id: "bebidas",
        name: "Bebidas",
        description: "Bebidas y refrescos",
        icon: "fas fa-mug-hot",
        count: 0
    },
    {
        id: "limpieza",
        name: "Limpieza",
        description: "Productos de higiene y limpieza del hogar",
        icon: "fas fa-spray-can",
        count: 0
    }
];

// Función para obtener productos por categoría
function getProductsByCategory(category) {
    if (category === 'all') return productsData;
    return productsData.filter(product => product.category === category);
}

// Función para buscar productos
function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return productsData;

    return productsData.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// Función para obtener producto por ID
function getProductById(id) {
    return productsData.find(product => product.id === parseInt(id));
}

// Función para actualizar contador de categorías
function updateCategoryCounts() {
    categoriesData.forEach(category => {
        category.count = productsData.filter(product => product.category === category.id).length;
    });
}

updateCategoryCounts();

if (typeof window !== 'undefined') {
    window.productsData = productsData;
    window.categoriesData = categoriesData;
    window.getProductsByCategory = getProductsByCategory;
    window.searchProducts = searchProducts;
    window.getProductById = getProductById;
    window.updateCategoryCounts = updateCategoryCounts;
}

