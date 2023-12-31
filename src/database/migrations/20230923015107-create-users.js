'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('users', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      name: Sequelize.STRING, 
      email: Sequelize.STRING, 
      picture: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('users');

    
  }
};
