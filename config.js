// =========================
// CONFIG (EDITABLE ACÁ)
// =========================

// WhatsApp (wa.me: solo dígitos; Argentina móvil = 54 + 9 + código área + número)
const whatsappConfig = {
    phoneNumber: "5492615750410",
    message: "Hola! 👋 quisiera consultar precios y disponibilidad de productos."
};

// Configuración general
const appConfig = {
    companyName: "Ruta Stock",
    companyPhone: "+54 9 261 5750410",
    companyEmail: "info@rutastock.com",
    companyAddress: "Buenos Aires, Argentina",
    deliveryHours: "Lun - Sáb: 8:00 - 20:00",
    currency: "$",
    minOrderAmount: 1000
};

if (typeof window !== 'undefined') {
    window.whatsappConfig = whatsappConfig;
    window.appConfig = appConfig;
}

