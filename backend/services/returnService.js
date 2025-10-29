// backend/services/returnService.js
const db = require('../models');

async function getAllReturns(filters = {}) {
  const { productId, startDate, endDate } = filters;
  
  const whereConditions = {};
  
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
  
  const returns = await db.Return.findAll({
    where: whereConditions,
    include: [
      {
        model: db.Product,
        attributes: ['name', 'sku']
      }
    ],
    order: [['date', 'DESC']]
  });
  
  return returns;
}

async function createReturn(returnData) {
  const { productId, qty, reason, responsible } = returnData;
  
  // Verificar que el producto exista
  const product = await db.Product.findByPk(productId);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  
  // Crear devolución en la base de datos
  const newReturn = await db.Return.create({
    date: new Date(),
    product_id: productId,
    qty,
    reason,
    responsible
  });
  
  // Actualizar stock del producto
  product.stock += qty;
  await product.save();
  
  // Retornar devolución creada con información del producto
  return await db.Return.findByPk(newReturn.id, {
    include: [
      {
        model: db.Product,
        attributes: ['name', 'sku']
      }
    ]
  });
}

async function getReturnById(id) {
  const returnRecord = await db.Return.findByPk(id, {
    include: [
      {
        model: db.Product,
        attributes: ['name', 'sku']
      }
    ]
  });
  return returnRecord;
}

async function updateReturn(id, updateData) {
  const returnRecord = await db.Return.findByPk(id);
  if (!returnRecord) {
    throw new Error('Devolución no encontrada');
  }
  
  // Solo permitir actualizar ciertos campos
  const allowedFields = ['reason', 'responsible'];
  const filteredUpdateData = {};
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredUpdateData[field] = updateData[field];
    }
  }
  
  await returnRecord.update(filteredUpdateData);
  
  return await db.Return.findByPk(returnRecord.id, {
    include: [
      {
        model: db.Product,
        attributes: ['name', 'sku']
      }
    ]
  });
}

async function deleteReturn(id) {
  const returnRecord = await db.Return.findByPk(id);
  if (!returnRecord) {
    throw new Error('Devolución no encontrada');
  }
  
  // Revertir el cambio en el stock del producto
  const product = await db.Product.findByPk(returnRecord.product_id);
  if (product) {
    product.stock -= returnRecord.qty;
    
    // Asegurarse de que el stock no sea negativo
    if (product.stock < 0) product.stock = 0;
    
    await product.save();
  }
  
  await returnRecord.destroy();
  return true;
}

module.exports = {
  getAllReturns,
  createReturn,
  getReturnById,
  updateReturn,
  deleteReturn
};