module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
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
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {});
  Feedback.associate = () => {
  };
  return Feedback;
};
