// backend/services/movementService.js
const db = require('../models');

async function getAllMovements(filters = {}) {
  const { type, productId, startDate, endDate } = filters;
  
  const whereConditions = {};
  
  if (type) {
    whereConditions.type = type;
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
  
  const movements = await db.Movement.findAll({
    where: whereConditions,
    include: [
      {
        model: db.Product,
        attributes: ['name', 'sku']
      }
    ],
    order: [['date', 'DESC']]
  });
  
  return movements;
}

async function createMovement(movementData) {
  const { type, productId, qty, responsible, notes } = movementData;
  
  // Verificar que el producto exista
  const product = await db.Product.findByPk(productId);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  
  // Verificar stock suficiente para salidas
  if (type === 'salida' && product.stock < qty) {
    throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
  }
  
  // Crear movimiento en la base de datos
  const newMovement = await db.Movement.create({
    date: new Date(),
    type,
    product_id: productId,
    qty,
    responsible,
    notes
  });
  
  // Actualizar stock del producto
  if (type === 'entrada') {
    product.stock += qty;
  } else if (type === 'salida') {
    product.stock -= qty;
  }
  
  await product.save();
  
  // Retornar movimiento creado con información del producto
  return await db.Movement.findByPk(newMovement.id, {
    include: [
      {
        model: db.Product,
        attributes: ['name', 'sku']
      }
    ]
  });
}

async function getMovementById(id) {
  const movement = await db.Movement.findByPk(id, {
    include: [
      {
        model: db.Product,
        attributes: ['name', 'sku']
      }
    ]
  });
  return movement;
}

async function updateMovement(id, updateData) {
  const movement = await db.Movement.findByPk(id);
  if (!movement) {
    throw new Error('Movimiento no encontrado');
  }
  
  // Solo permitir actualizar ciertos campos
  const allowedFields = ['notes', 'responsible'];
  const filteredUpdateData = {};
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredUpdateData[field] = updateData[field];
    }
  }
  
  await movement.update(filteredUpdateData);
  
  return await db.Movement.findByPk(movement.id, {
    include: [
      {
        model: db.Product,
        attributes: ['name', 'sku']
      }
    ]
  });
}

async function deleteMovement(id) {
  const movement = await db.Movement.findByPk(id);
  if (!movement) {
    throw new Error('Movimiento no encontrado');
  }
  
  // Revertir el cambio en el stock del producto
  const product = await db.Product.findByPk(movement.product_id);
  if (product) {
    if (movement.type === 'entrada') {
      product.stock -= movement.qty;
    } else if (movement.type === 'salida') {
      product.stock += movement.qty;
    }
    
    // Asegurarse de que el stock no sea negativo
    if (product.stock < 0) product.stock = 0;
    
    await product.save();
  }
  
  await movement.destroy();
  return true;
}

module.exports = {
  getAllMovements,
  createMovement,
  getMovementById,
  updateMovement,
  deleteMovement
};