
const { MercadoPagoConfig } = require('mercadopago');

// Configura tus credenciales de acceso desde la variable de entorno
const mercadoPago = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

module.exports = mercadoPago;
