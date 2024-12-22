// app.js - Configuración de la aplicación y rutas
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDatabase } = require('./config/bdHelper');

// Inicializar Express
const app = express();

// Conexión a la base de datos
connectToDatabase();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/cintos', require('./routes/rutasCintos'));
app.use('/tutores', require('./routes/rutasTutores'));
app.use('/escuelas', require('./routes/rutasEscuelas'));
app.use('/georef', require('./routes/rutasGeoref'));
app.use('/miembros', require('./routes/rutasMiembros'));
app.use('/sedes', require('./routes/rutasSedes'));
app.use('/publicaciones', require('./routes/rutasPublicaciones'));
app.use('/mercadopago', require('./routes/rutasPagos'));

// Exportar la app
module.exports = app;
