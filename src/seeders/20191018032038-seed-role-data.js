module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Roles', [{
    label: 'superAdmin',
    description: 'SuperAdmin has extensive priviledge in the application'
  },
  {
    label: 'admin',
    description: 'admin with special priviledges'
  },
  {
    label: 'user',
    description: 'user priviledge for greenpot application'
  }]),

  down: (queryInterface) => queryInterface.bulkDelete('Roles', null, {})
};
