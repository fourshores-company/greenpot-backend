module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    status: {
      type: DataTypes.ENUM('completed', 'pending'),
      allowNull: false,
      defaultValue: 'pending'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {});
  Order.associate = (models) => {
    Order.belongsToMany(models.Meal, {
      through: 'OrderMeals',
      as: 'meals',
      foreignKey: 'orderId'
    });
  };
  return Order;
};
