'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Random_names_back extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Random_names_back.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Random_names_back',
      tableName: 'random_names_back',
      timestamps: true,
      underscored: true,
    }
  );
  return Random_names_back;
};
