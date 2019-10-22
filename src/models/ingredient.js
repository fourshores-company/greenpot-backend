module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    unit: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DOUBLE
    },
  }, {});
  Ingredient.associate = (models) => {
    // associations can be defined here
  };
  return Ingredient;
};
