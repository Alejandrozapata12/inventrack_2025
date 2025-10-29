// backend/models/Movement.js
module.exports = (sequelize, DataTypes) => {
  const Movement = sequelize.define('Movement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('entrada', 'salida'),
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    responsible: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'movements',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Movement.associate = function(models) {
    Movement.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Movement;
};