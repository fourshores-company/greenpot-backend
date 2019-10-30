module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    category: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {});
  Category.associate = (models) => {
    Category.belongsToMany(models.Meal, {
      through: 'MealCategories',
      as: 'meals',
      foreignKey: 'categoryId'
    });
  };
  return Category;
};
