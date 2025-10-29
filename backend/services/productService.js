// backend/services/productService.js
const db = require('../models');

async function getAllProducts(filters = {}) {
  const { categoryId, minStock, maxStock, search } = filters;
  
  const whereConditions = {};
  
  if (categoryId) {
    whereConditions.category_id = categoryId;
  }
  
  if (minStock !== undefined) {
    whereConditions.stock = { [db.Sequelize.Op.gte]: minStock };
  }
  
  if (maxStock !== undefined) {
    whereConditions.stock = { ...whereConditions.stock, [db.Sequelize.Op.lte]: maxStock };
  }
  
  if (search) {
    whereConditions[db.Sequelize.Op.or] = [
      { name: { [db.Sequelize.Op.like]: `%${search}%` } },
      { sku: { [db.Sequelize.Op.like]: `%${search}%` } }
    ];
  }
  
  const products = await db.Product.findAll({
    where: whereConditions,
    include: [
      { model: db.Category, attributes: ['name'] },
      { model: db.Supplier, attributes: ['name'] }
    ],
    order: [['created_at', 'DESC']]
  });
  
  return products;
}

async function getProductById(id) {
  const product = await db.Product.findByPk(id, {
    include: [
      { model: db.Category, attributes: ['name'] },
      { model: db.Supplier, attributes: ['name'] }
    ]
  });
  return product;
}

async function createProduct(productData) {
  const { sku, name, categoryId, supplierId, stock, price, location, lowStockThreshold } = productData;
  
  // Verificar si el SKU ya existe
  const existingProduct = await db.Product.findOne({ where: { sku } });
  if (existingProduct) {
    throw new Error('El SKU ya está en uso');
  }
  
  const newProduct = await db.Product.create({
    sku,
    name,
    category_id: categoryId,
    supplier_id: supplierId,
    stock: parseInt(stock) || 0,
    price: parseFloat(price) || 0.00,
    location,
    low_stock_threshold: parseInt(lowStockThreshold) || 5
  });
  
  return newProduct;
}

async function updateProduct(id, updateData) {
  const product = await db.Product.findByPk(id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  
  await product.update(updateData);
  return await db.Product.findByPk(id);
}

async function deleteProduct(id) {
  const product = await db.Product.findByPk(id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  
  await product.destroy();
  return true;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};