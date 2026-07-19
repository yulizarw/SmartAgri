'use strict';

/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();
const bcrypt = require("bcryptjs");
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    console.log(process.env.EMAILADMIN)
    await queryInterface.bulkInsert('Users', [{
      fullName: "Administrator",
      email: process.env.EMAILADMIN,
      password: bcrypt.hashSync(process.env.PASSWORDADMIN, 10),
      roleId: 1,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};