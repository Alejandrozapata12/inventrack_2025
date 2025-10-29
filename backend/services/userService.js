// backend/services/userService.js
const db = require('../models');
const { hashPassword } = require('../utils/passwordUtils');

async function getAllUsers() {
  const users = await db.User.findAll({
    attributes: { exclude: ['password_hash'] }, // Excluir contraseña del resultado
    order: [['created_at', 'DESC']]
  });
  return users;
}

async function getUserById(id) {
  const user = await db.User.findByPk(id, {
    attributes: { exclude: ['password_hash'] } // Excluir contraseña del resultado
  });
  return user;
}

async function createUser(userData) {
  const { name, email, password, role = 'employee' } = userData;
  
  // Verificar si el usuario ya existe
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('El correo electrónico ya está registrado');
  }
  
  // Encriptar contraseña
  const hashedPassword = await hashPassword(password);
  
  // Crear nuevo usuario
  const newUser = await db.User.create({
    name,
    email,
    password_hash: hashedPassword,
    role
  });
  
  // Excluir contraseña del resultado
  const { password_hash, ...userWithoutPassword } = newUser.toJSON();
  return userWithoutPassword;
}

async function updateUser(id, updateData) {
  const { name, email, role, profile_pic } = updateData;
  
  // Verificar si el usuario existe
  const user = await db.User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  // Verificar si el email ya está en uso por otro usuario
  if (email) {
    const existingUser = await db.User.findOne({
      where: {
        email,
        id: { [db.Sequelize.Op.ne]: id }
      }
    });
    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }
  }
  
  // Actualizar usuario
  await user.update({
    name,
    email,
    role,
    profile_pic
  });
  
  // Obtener usuario actualizado (excluyendo contraseña)
  const updatedUser = await db.User.findByPk(id, {
    attributes: { exclude: ['password_hash'] }
  });
  
  return updatedUser;
}

async function deleteUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  // Verificar si es el último usuario admin (no se puede eliminar)
  if (user.role === 'admin') {
    const adminCount = await db.User.count({ where: { role: 'admin' } });
    if (adminCount <= 1) {
      throw new Error('No se puede eliminar el último usuario administrador');
    }
  }
  
  await user.destroy();
  return true;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};