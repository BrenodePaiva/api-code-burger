"use strict";'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
    })
    await queryInterface.addColumn('orders', 'quantity', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'status')
    await queryInterface.removeColumn('orders', 'quantity')
  },
}
