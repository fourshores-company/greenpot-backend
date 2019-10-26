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
    Ingredient.belongsToMany(models.Meal, {
      through: 'MealIngredients',
      as: 'meals',
      foreignKey: 'ingredientId'
    });
  };
  return Ingredient;
};
