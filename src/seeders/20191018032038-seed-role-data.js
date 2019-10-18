module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Roles', [{
    label: 'admin',
    description: 'Admin has extensive priviledge in the application'
  },
  {
    label: 'user',
    description: 'user proviledge for greenpot application'
  }]),

  down: (queryInterface) => queryInterface.bulkDelete('Roles', null, {})
};