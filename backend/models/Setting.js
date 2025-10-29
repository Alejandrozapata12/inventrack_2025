// backend/models/Setting.js
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    low_stock_threshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    notify: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    language: {
      type: DataTypes.STRING(10),
      defaultValue: 'es'
    }
  }, {
    tableName: 'settings',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at'
  });

  return Setting;
};