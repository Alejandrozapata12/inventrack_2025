// backend/middleware/validationMiddleware.js
const { sendError } = require('../utils/responseUtils');

// Validación de correo electrónico
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validación de contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// Validación de nombre (mínimo 2 caracteres, solo letras y espacios)
function validateName(name) {
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name);
}

// Validación de SKU (mínimo 3 caracteres, solo letras, números y guiones)
function validateSKU(sku) {
  const skuRegex = /^[a-zA-Z0-9\-_]{3,}$/;
  return skuRegex.test(sku);
}

// Validación de cantidad (número entero positivo)
function validateQuantity(qty) {
  return Number.isInteger(qty) && qty > 0;
}

// Validación de precio (número decimal positivo con máximo 2 decimales)
function validatePrice(price) {
  return typeof price === 'number' && price >= 0 && /^\d+(\.\d{1,2})?$/.test(price.toString());
}

// Validación de tipo de movimiento (entrada o salida)
function validateMovementType(type) {
  return ['entrada', 'salida'].includes(type);
}

// Validación de estado de solicitud (Pendiente, Aprobada, Rechazada)
function validateRequestStatus(status) {
  return ['Pendiente', 'Aprobada', 'Rechazada'].includes(status);
}

// Validación de rol de usuario (admin o employee)
function validateUserRole(role) {
  return ['admin', 'employee'].includes(role);
}

// Middleware para validar datos de registro de usuario
function validateRegister(req, res, next) {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    return sendError(res, 'Nombre, correo y contraseña son obligatorios', 400);
  }
  
  if (!validateName(name)) {
    return sendError(res, 'El nombre debe tener al menos 2 caracteres y solo puede contener letras y espacios', 400);
  }
  
  if (!validateEmail(email)) {
    return sendError(res, 'Formato de correo electrónico inválido', 400);
  }
  
  if (!validatePassword(password)) {
    return sendError(res, 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número', 400);
  }
  
  if (role && !validateUserRole(role)) {
    return sendError(res, 'Rol inválido. Debe ser "admin" o "employee"', 400);
  }
  
  next();
}

// Middleware para validar datos de inicio de sesión
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return sendError(res, 'Correo y contraseña son obligatorios', 400);
  }
  
  if (!validateEmail(email)) {
    return sendError(res, 'Formato de correo electrónico inválido', 400);
  }
  
  next();
}

// Middleware para validar datos de producto
function validateProduct(req, res, next) {
  const { sku, name, categoryId, supplierId, stock, price, location, lowStockThreshold } = req.body;
  
  if (!sku || !name || !categoryId || !supplierId) {
    return sendError(res, 'SKU, nombre, categoría y proveedor son obligatorios', 400);
  }
  
  if (!validateSKU(sku)) {
    return sendError(res, 'El SKU debe tener al menos 3 caracteres y solo puede contener letras, números, guiones y guiones bajos', 400);
  }
  
  if (!validateName(name)) {
    return sendError(res, 'El nombre debe tener al menos 2 caracteres y solo puede contener letras y espacios', 400);
  }
  
  if (stock !== undefined && !Number.isInteger(stock)) {
    return sendError(res, 'El stock debe ser un número entero', 400);
  }
  
  if (price !== undefined && !validatePrice(price)) {
    return sendError(res, 'El precio debe ser un número decimal positivo con máximo 2 decimales', 400);
  }
  
  if (lowStockThreshold !== undefined && !Number.isInteger(lowStockThreshold)) {
    return sendError(res, 'El umbral de bajo stock debe ser un número entero', 400);
  }
  
  next();
}

// Middleware para validar datos de movimiento
function validateMovement(req, res, next) {
  const { type, productId, qty, responsible } = req.body;
  
  if (!type || !productId || !qty || !responsible) {
    return sendError(res, 'Tipo, producto, cantidad y responsable son obligatorios', 400);
  }
  
  if (!validateMovementType(type)) {
    return sendError(res, 'Tipo de movimiento inválido. Debe ser "entrada" o "salida"', 400);
  }
  
  if (!validateQuantity(qty)) {
    return sendError(res, 'La cantidad debe ser un número entero positivo', 400);
  }
  
  next();
}

// Middleware para validar datos de solicitud
function validateRequest(req, res, next) {
  const { productId, qty, responsible, justification, status } = req.body;
  
  if (!productId || !qty || !responsible || !justification) {
    return sendError(res, 'Producto, cantidad, responsable y justificación son obligatorios', 400);
  }
  
  if (!validateQuantity(qty)) {
    return sendError(res, 'La cantidad debe ser un número entero positivo', 400);
  }
  
  if (status && !validateRequestStatus(status)) {
    return sendError(res, 'Estado de solicitud inválido. Debe ser "Pendiente", "Aprobada" o "Rechazada"', 400);
  }
  
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateMovement,
  validateRequest
};