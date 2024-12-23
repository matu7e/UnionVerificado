// Importamos la app de Express desde tu backend
const app = require('../Backend/src/app'); // Ajusta la ruta si es necesario

// Exportamos la función handler para que Vercel pueda invocarla
module.exports = (req, res) => {
  app(req, res); // Delegamos las solicitudes a la app de Express
};
