module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Roles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    label: {
      type: Sequelize.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }),

  down: (queryInterface) => queryInterface.dropTable('Roles')
};
