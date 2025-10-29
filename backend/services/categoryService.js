// backend/services/categoryService.js
const db = require('../models');

async function getAllCategories() {
  const categories = await db.Category.findAll({
    order: [['created_at', 'DESC']]
  });
  return categories;
}

async function getCategoryById(id) {
  const category = await db.Category.findByPk(id);
  return category;
}

async function createCategory(categoryData) {
  const { name, description } = categoryData;
  
  // Verificar si la categoría ya existe
  const existingCategory = await db.Category.findOne({ where: { name } });
  if (existingCategory) {
    throw new Error('La categoría ya existe');
  }
  
  const newCategory = await db.Category.create({
    name,
    description
  });
  
  return newCategory;
}

async function updateCategory(id, updateData) {
  const category = await db.Category.findByPk(id);
  if (!category) {
    throw new Error('Categoría no encontrada');
  }
  
  await category.update(updateData);
  return await db.Category.findByPk(id);
}

async function deleteCategory(id) {
  const category = await db.Category.findByPk(id);
  if (!category) {
    throw new Error('Categoría no encontrada');
  }
  
  await category.destroy();
  return true;
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};