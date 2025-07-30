"use strict";'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'offer', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })

    await queryInterface.changeColumn('products', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'offer', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    })

    await queryInterface.changeColumn('products', 'price', {
      type: Sequelize.DECIMAL,
      allowNull: false,
    })
  },
}
