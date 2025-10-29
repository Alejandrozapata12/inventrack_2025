// backend/models/Return.js
module.exports = (sequelize, DataTypes) => {
  const Return = sequelize.define('Return', {
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
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    responsible: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'returns',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Return.associate = function(models) {
    Return.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Return;
};