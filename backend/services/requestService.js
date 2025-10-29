// backend/services/requestService.js
const db = require('../models');

async function getAllRequests(filters = {}) {
  const { status, productId, startDate, endDate } = filters;
  
  const whereConditions = {};
  
  if (status) {
    whereConditions.status = status;
  }
  
  if (productId) {
    whereConditions.product_id = productId;
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
  
  const requests = await db.Request.findAll({
    where: whereConditions,
    include: [
      {
        model: db.Product,
        attributes: ['name', 'sku']
      }
    ],
    order: [['date', 'DESC']]
  });
  
  return requests;
}

async function createRequest(requestData) {
  const { productId, qty, responsible, justification } = requestData;
  
  // Verificar que el producto exista
  const product = await db.Product.findByPk(productId);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  
  const newRequest = await db.Request.create({
    date: new Date(),
    product_id: productId,
    qty,
    responsible,
    justification,
    status: 'Pendiente'
  });
  
  return newRequest;
}

async function getRequestById(id) {
  const request = await db.Request.findByPk(id, {
    include: [
      {
        model: db.Product,
        attributes: ['name', 'sku']
      }
    ]
  });
  return request;
}

async function updateRequestStatus(id, status, adminId) {
  const request = await db.Request.findByPk(id);
  if (!request) {
    throw new Error('Solicitud no encontrada');
  }
  
  if (status !== 'Aprobada' && status !== 'Rechazada') {
    throw new Error('Estado inválido');
  }
  
  request.status = status;
  await request.save();
  
  // Si se aprueba, actualizar stock
  if (status === 'Aprobada') {
    const product = await db.Product.findByPk(request.product_id);
    if (product) {
      product.stock += request.qty;
      await product.save();
    }
  }
  
  return request;
}

async function deleteRequest(id) {
  const request = await db.Request.findByPk(id);
  if (!request) {
    throw new Error('Solicitud no encontrada');
  }
  
  await request.destroy();
  return true;
}

module.exports = {
  getAllRequests,
  createRequest,
  getRequestById,
  updateRequestStatus,
  deleteRequest
};