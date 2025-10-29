// backend/services/supplierService.js
const db = require('../models');

async function getAllSuppliers() {
  const suppliers = await db.Supplier.findAll({
    order: [['created_at', 'DESC']]
  });
  return suppliers;
}

async function getSupplierById(id) {
  const supplier = await db.Supplier.findByPk(id);
  return supplier;
}

async function createSupplier(supplierData) {
  const { name, contactPerson, email, phone, address } = supplierData;
  
  // Verificar si el proveedor ya existe
  const existingSupplier = await db.Supplier.findOne({ where: { name } });
  if (existingSupplier) {
    throw new Error('El proveedor ya existe');
  }
  
  const newSupplier = await db.Supplier.create({
    name,
    contact_person: contactPerson,
    email,
    phone,
    address
  });
  
  return newSupplier;
}

async function updateSupplier(id, updateData) {
  const supplier = await db.Supplier.findByPk(id);
  if (!supplier) {
    throw new Error('Proveedor no encontrado');
  }
  
  await supplier.update(updateData);
  return await db.Supplier.findByPk(id);
}

async function deleteSupplier(id) {
  const supplier = await db.Supplier.findByPk(id);
  if (!supplier) {
    throw new Error('Proveedor no encontrado');
  }
  
  await supplier.destroy();
  return true;
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};