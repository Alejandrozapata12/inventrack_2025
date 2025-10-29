// backend/models/Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'suppliers',
        key: 'id'
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    low_stock_threshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    }
  }, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    Product.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
    Product.hasMany(models.Movement, { foreignKey: 'product_id' });
    Product.hasMany(models.Request, { foreignKey: 'product_id' });
    Product.hasMany(models.Return, { foreignKey: 'product_id' });
  };

  return Product;
};