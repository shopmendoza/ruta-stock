# Ruta Stock - Distribuidora Web

Una página web moderna y responsive para distribuidoras, diseñada para funcionar como catálogo online y sistema de pedidos simple.

## 🚀 Características

- **Diseño moderno**: Estética minimalista con colores negro y amarillo
- **Responsive**: Optimizada para dispositivos móviles
- **Catálogo de productos**: Organizado por categorías con filtros
- **Sistema de carrito**: Agregar, modificar y eliminar productos
- **Integración WhatsApp**: Envío automático de pedidos
- **Geolocalización**: Obtención automática de ubicación del cliente
- **Sin backend**: Funciona completamente en frontend
- **GitHub Pages ready**: Lista para subir a GitHub Pages

## 📁 Estructura del Proyecto

```
ruta-stock/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidad JavaScript
├── config.js           # Configuración (empresa + WhatsApp)
├── productos.js        # Productos + categorías (editable)
├── img/
│   └── productos/      # Imágenes de productos (poné tus fotos acá)
└── README.md           # Este archivo
```

## 🛠️ Instalación y Uso

### Opción 1: Uso Local
1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en tu navegador
3. ¡Listo! La página está funcionando

### Opción 2: GitHub Pages
1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a Settings > Pages
4. Selecciona "Deploy from a branch" > "main"
5. Tu página estará disponible en `https://tuusuario.github.io/tu-repositorio`

## ⚙️ Configuración

### Cambiar Datos de la Empresa
Edita el archivo `config.js` y modifica la sección `appConfig`:

```javascript
const appConfig = {
    companyName: "Tu Distribuidora",
    companyPhone: "+54 9 11 XXXX-XXXX",
    companyEmail: "info@tudistribuidora.com",
    companyAddress: "Tu Dirección, Ciudad",
    deliveryHours: "Lun - Sáb: 8:00 - 20:00",
    currency: "$",
    minOrderAmount: 1000
};
```

### Configurar WhatsApp
En `config.js`, actualiza la configuración de WhatsApp:

```javascript
const whatsappConfig = {
    phoneNumber: "5491112345678", // Tu número de WhatsApp (con código de país)
    message: "¡Hola! Me interesa hacer un pedido desde Tu Distribuidora:"
};
```

### Agregar/Modificar Productos
En `productos.js`, edita el array `productsData`:

```javascript
{
    id: 26, // ID único
    name: "Nuevo Producto",
    category: "categoria", // huevos, almacen, bebidas (o las que agregues en categoriesData)
    price: 500,
    description: "Descripción del producto",
    image: "img/productos/archivo.jpg", // ruta local o link (o null para usar ícono)
    icon: "fas fa-box" // Ícono de FontAwesome
}
```

### Agregar Nuevas Categorías
1. Agrega la categoría en `categoriesData` en `productos.js`
2. Agrega productos con esa categoría en `productsData`
3. Los filtros se generan solos (no hay que tocar `index.html`)

### Imágenes de Productos
1. Poné las fotos dentro de `img/productos/` (por ejemplo `img/productos/huevos.jpg`)
2. En `productos.js` asigná `image: "img/productos/huevos.jpg"`

## 🎨 Personalización de Diseño

### Cambiar Colores
En `styles.css`, modifica las variables CSS:

```css
:root {
    --primary-color: #FFD700;        /* Color principal (amarillo) */
    --primary-dark: #FFC107;         /* Amarillo oscuro */
    --secondary-color: #1a1a1a;      /* Color secundario */
    --background-dark: #0d0d0d;      /* Fondo oscuro */
    --background-light: #1a1a1a;     /* Fondo claro */
    /* ... más variables ... */
}
```

### Cambiar Fuentes
Modifica el enlace de Google Fonts en `index.html` y actualiza la fuente en CSS:

```css
body {
    font-family: 'Tu-Fuente', sans-serif;
}
```

## 📱 Funcionalidades

### Catálogo
- ✅ Visualización de productos por categorías
- ✅ Filtros por categoría
- ✅ Búsqueda de productos
- ✅ Cards responsive con información completa

### Carrito de Compras
- ✅ Agregar productos al carrito
- ✅ Modificar cantidades
- ✅ Eliminar productos
- ✅ Persistencia en localStorage
- ✅ Cálculo automático de totales

### Sistema de Pedidos
- ✅ Formulario de datos del cliente
- ✅ Geolocalización automática
- ✅ Generación de mensaje para WhatsApp
- ✅ Envío automático a WhatsApp

### Responsive Design
- ✅ Adaptado para móviles
- ✅ Menú hamburguesa en móviles
- ✅ Cards adaptables
- ✅ Modales responsive

## 🔧 Personalización Avanzada

### Agregar Imágenes de Productos
1. Crea una carpeta `images/` en tu proyecto
2. Agrega las imágenes de productos
3. En `data.js`, cambia `image: null` por `image: "images/producto.jpg"`

### Modificar el Logo
1. Reemplaza el ícono en el header por una imagen:
```html
<div class="logo">
    <img src="images/logo.png" alt="Logo" style="height: 40px;">
    <span>Tu Distribuidora</span>
</div>
```

### Agregar Más Secciones
Puedes agregar nuevas secciones como "Sobre Nosotros", "Testimonios", etc. siguiendo la estructura HTML existente.

## 📞 Soporte

### Problemas Comunes

**El carrito no funciona:**
- Verifica que JavaScript esté habilitado
- Revisa la consola del navegador para errores

**WhatsApp no abre:**
- Verifica que el número esté en formato internacional
- Asegúrate de que WhatsApp esté instalado

**La página no se ve bien en móvil:**
- Verifica que tengas la meta tag viewport en el HTML
- Revisa los media queries en CSS

### Personalización del Mensaje de WhatsApp
Puedes modificar la función `generateOrderMessage()` en `script.js` para cambiar el formato del mensaje que se envía por WhatsApp.

## 🚀 Mejoras Futuras

Algunas ideas para expandir la funcionalidad:

- [ ] Sistema de usuarios/login
- [ ] Historial de pedidos
- [ ] Integración con APIs de pago
- [ ] Panel de administración
- [ ] Notificaciones push
- [ ] Sistema de descuentos
- [ ] Múltiples métodos de contacto

## 📄 Licencia

Este proyecto es de uso libre. Puedes modificarlo y usarlo para tu negocio sin restricciones.

## 🤝 Contribuciones

Si encuentras errores o tienes sugerencias de mejora, no dudes en reportarlos o contribuir al proyecto.

---

**¡Gracias por usar Ruta Stock!** 🚚

Para más información o soporte, contacta a través de los canales disponibles en la página web.