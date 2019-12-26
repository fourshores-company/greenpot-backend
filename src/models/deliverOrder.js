module.exports = (sequelize, DataTypes) => {
  const DeliverOrder = sequelize.define('DeliverOrder', {
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
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Order',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {});
  DeliverOrder.associate = () => {
  };
  return DeliverOrder;
};
