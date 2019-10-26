module.exports = (sequelize, DataTypes) => {
  const MealIngredient = sequelize.define(
    'MealIngredient',
    {
      mealId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Meal',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Ingredient',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ingredientQuantity: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
    },
    {}
  );
  MealIngredient.associate = () => {
  };
  return MealIngredient;
};
