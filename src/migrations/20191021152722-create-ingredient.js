
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Ingredients', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    unit: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: true,
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
  down: (queryInterface) => queryInterface.dropTable('Ingredients')
};
