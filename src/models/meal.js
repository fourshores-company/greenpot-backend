module.exports = (sequelize, DataTypes) => {
  const Meal = sequelize.define('Meal', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    recipe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    prepTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {});
  Meal.associate = (models) => {
    Meal.belongsToMany(models.Ingredient, {
      through: 'MealIngredients',
      as: 'ingredients',
      foreignKey: 'mealId'
    });
    Meal.belongsToMany(models.Category, {
      through: 'MealCategories',
      as: 'categories',
      foreignKey: 'mealId'
    });
  };
  return Meal;
};
