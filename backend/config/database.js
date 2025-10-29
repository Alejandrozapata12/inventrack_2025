// backend/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Verificar que todas las variables de entorno necesarias estén definidas
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
  throw new Error('Faltan variables de entorno para la conexión a la base de datos. Verifica tu archivo .env');
}

const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nombre de la base de datos
  process.env.DB_USER,      // Usuario
  process.env.DB_PASSWORD,  // Contraseña
  {
    host: process.env.DB_HOST || 'localhost',    // Host
    port: process.env.DB_PORT || 3306,          // Puerto
    dialect: process.env.DB_DIALECT || 'mysql', // Dialecto (debe ser una cadena)
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Probar la conexión
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    throw error; // Lanzar el error para que pueda ser manejado por quien lo llame
  }
}

module.exports = { sequelize, testConnection };