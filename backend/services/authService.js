// backend/services/authService.js
const db = require('../models');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');
const { sendError } = require('../utils/responseUtils');

async function register(userData) {
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

  return newUser;
}

async function login(email, password) {
  // Buscar usuario por email
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar contraseña
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  // Generar token JWT
  const token = generateToken(user);

  return { user, token };
}

async function getProfile(userId) {
  const user = await db.User.findByPk(userId, {
    attributes: { exclude: ['password_hash'] } // Excluir contraseña
  });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
}

async function updateProfile(userId, updateData) {
  const { name, email, profile_pic } = updateData;

  // Verificar si el email ya está en uso por otro usuario
  if (email) {
    const existingUser = await db.User.findOne({
      where: {
        email,
        id: { [db.Sequelize.Op.ne]: userId }
      }
    });
    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }
  }

  // Actualizar usuario
  const [updatedRowsCount] = await db.User.update(
    { name, email, profile_pic },
    { where: { id: userId } }
  );

  if (updatedRowsCount === 0) {
    throw new Error('Usuario no encontrado');
  }

  // Obtener usuario actualizado
  const updatedUser = await db.User.findByPk(userId, {
    attributes: { exclude: ['password_hash'] }
  });

  return updatedUser;
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};