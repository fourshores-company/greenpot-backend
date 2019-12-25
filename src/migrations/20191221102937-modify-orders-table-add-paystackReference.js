
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Orders', 'paystackReference', {
    type: Sequelize.STRING,
    allowNull: true,
  }),
  down: (queryInterface) => queryInterface.removeColumn('Orders', 'paystackReference')
};
