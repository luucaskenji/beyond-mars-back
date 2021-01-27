'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sessions', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false
    });

    await queryInterface.addColumn('sessions', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sessions', 'createdAt');
    await queryInterface.removeColumn('sessions', 'updatedAt');
  }
};