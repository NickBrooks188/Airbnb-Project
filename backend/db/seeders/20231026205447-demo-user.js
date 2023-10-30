'use strict';

const bcrypt = require("bcryptjs");

const { User } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Users'

const users = [
  {
    email: 'test@gmail.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'Testman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'best@gmail.com',
    username: 'bestUser',
    firstName: 'Best',
    lastName: 'Bestman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'west@gmail.com',
    username: 'westUser',
    firstName: 'West',
    lastName: 'Westman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'vest@gmail.com',
    username: 'vestUser',
    firstName: 'Vest',
    lastName: 'Vestman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'lest@gmail.com',
    username: 'lestUser',
    firstName: 'Lest',
    lastName: 'Lestman',
    hashedPassword: bcrypt.hashSync('password')
  }
]

/** @type {import('sequelize-cli').Migration} */
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
    await User.bulkCreate(users, { validate: true })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['testuser', 'bestUser', 'westUser', 'vestUser', 'lestUser'] }
    }, {});
  }
};
