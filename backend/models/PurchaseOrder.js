module.exports = (sequelize, DataTypes) => {
  const PurchaseOrder = sequelize.define('PurchaseOrder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.ENUM('Creado', 'Enviado', 'Recibido Parcial', 'Recibido Completo', 'Cancelado'),
      defaultValue: 'Creado'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'purchase_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  PurchaseOrder.associate = function(models) {
    PurchaseOrder.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
  };

  return PurchaseOrder;
};