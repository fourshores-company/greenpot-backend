module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('MealIngredients', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    mealId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Meals',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    ingredientId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Ingredients',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    ingredientQuantity: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('MealIngredients')
};
