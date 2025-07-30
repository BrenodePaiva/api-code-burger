"use strict";'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('orders', 'id', {
      type: Sequelize.STRING(13),
      allowNull: false,
      primaryKey: true,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('orders', 'id', {
      type: Sequelize.STRING(7),
      allowNull: false,
      primaryKey: true,
    })
  },
}
