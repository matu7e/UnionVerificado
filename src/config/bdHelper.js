const sql = require('mssql');

// Configuración de la base de datos
const config = {
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  server: process.env.DB_SERVER, 
  database: process.env.DB_DATABASE, 
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Convertir a booleano
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true', // Convertir a booleano
    enableArithAbort: process.env.DB_ENABLE_ARITH_ABORT === 'true' // Convertir a booleano
  }
};

// Conexión a la base de datos
async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Conectado a la base de datos.');
  } catch (err) {
    console.error('Error de conexión con la base de datos:', err);
  }
}

module.exports = { connectToDatabase, sql };
