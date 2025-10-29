// backend/models/Request.js
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
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
    justification: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada'),
      defaultValue: 'Pendiente'
    }
  }, {
    tableName: 'requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Request.associate = function(models) {
    Request.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Request;
};