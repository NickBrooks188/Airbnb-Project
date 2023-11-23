'use strict';

const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Users'

const { User } = require('../models')

const users = [
  {
    email: 'test@gmail.com',
    username: 'demouser',
    firstName: 'Demo',
    lastName: 'User',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'best@gmail.com',
    username: 'bestUser',
    firstName: 'John',
    lastName: 'Testman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'west@gmail.com',
    username: 'westUser',
    firstName: 'Joe',
    lastName: 'Testman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'vest@gmail.com',
    username: 'vestUser',
    firstName: 'Jacob',
    lastName: 'Testman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'lest@gmail.com',
    username: 'lestUser',
    firstName: 'Jason',
    lastName: 'Testman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'nest@gmail.com',
    username: 'nestUser',
    firstName: 'Jack',
    lastName: 'Testman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'pest@gmail.com',
    username: 'pestUser',
    firstName: 'James',
    lastName: 'Testman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'fest@gmail.com',
    username: 'festUser',
    firstName: 'Jonah',
    lastName: 'Testman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'rest@gmail.com',
    username: 'restUser',
    firstName: 'Jim',
    lastName: 'Testman',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'zest@gmail.com',
    username: 'zestUser',
    firstName: 'Jacques',
    lastName: 'Testman',
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
      username: { [Op.in]: ['demouser', 'bestUser', 'westUser', 'vestUser', 'lestUser', 'zestUser', 'pestUser', 'restUser', 'nestUser', 'festUser'] }
    }, {});
  }
};
