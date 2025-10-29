// backend/services/settingService.js
const db = require('../models');

async function getSettings() {
  // Asumimos que solo hay una fila de configuración
  let settings = await db.Setting.findOne();
  
  // Si no existe, crear una con valores predeterminados
  if (!settings) {
    settings = await db.Setting.create({
      low_stock_threshold: 5,
      notify: true,
      language: 'es'
    });
  }
  
  return settings;
}

async function updateSettings(updateData) {
  // Asumimos que solo hay una fila de configuración
  let settings = await db.Setting.findOne();
  
  // Si no existe, crear una
  if (!settings) {
    settings = await db.Setting.create({});
  }
  
  await settings.update(updateData);
  return await db.Setting.findByPk(settings.id);
}

module.exports = {
  getSettings,
  updateSettings
};