// backend/services/logService.js
const db = require('../models');

async function getAllLogs(filters = {}) {
  const { userId, actionType, startDate, endDate } = filters;
  
  const whereConditions = {};
  
  if (userId) {
    whereConditions.user_id = userId;
  }
  
  if (actionType) {
    whereConditions.action_type = actionType;
  }
  
  if (startDate || endDate) {
    whereConditions.date = {};
    if (startDate) {
      whereConditions.date[db.Sequelize.Op.gte] = new Date(startDate);
    }
    if (endDate) {
      whereConditions.date[db.Sequelize.Op.lte] = new Date(endDate);
    }
  }
  
  const logs = await db.Log.findAll({
    where: whereConditions,
    include: [
      {
        model: db.User,
        attributes: ['name', 'email']
      }
    ],
    order: [['date', 'DESC']]
  });
  
  return logs;
}

async function getLogById(id) {
  const log = await db.Log.findByPk(id, {
    include: [
      {
        model: db.User,
        attributes: ['name', 'email']
      }
    ]
  });
  return log;
}

async function createLog(logData) {
  const { date, userId, actionType, details } = logData;
  
  const newLog = await db.Log.create({
    date: date || new Date(),
    user_id: userId,
    action_type: actionType,
    details
  });
  
  return newLog;
}

async function updateLog(id, updateData) {
  const log = await db.Log.findByPk(id);
  if (!log) {
    throw new Error('Registro no encontrado');
  }
  
  await log.update(updateData);
  return await db.Log.findByPk(id);
}

async function deleteLog(id) {
  const log = await db.Log.findByPk(id);
  if (!log) {
    throw new Error('Registro no encontrado');
  }
  
  await log.destroy();
  return true;
}

module.exports = {
  getAllLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog
};