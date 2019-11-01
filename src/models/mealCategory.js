module.exports = (sequelize, DataTypes) => {
  const MealCategory = sequelize.define('MealCategory', {
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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Category',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  MealCategory.associate = () => {

  };
  return MealCategory;
};
