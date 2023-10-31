'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Bookings'

const { Booking } = require('../models')

const bookings = [{
  spotId: 1,
  userId: 1,
  startDate: '01-01-2020',
  endDate: '01-05-2020'
},
{
  spotId: 2,
  userId: 2,
  startDate: '01-01-2021',
  endDate: '01-04-2021'
},
{
  spotId: 3,
  userId: 3,
  startDate: '01-03-2022',
  endDate: '01-05-2022'
}]

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
    await Booking.bulkCreate(bookings, { validate: true })
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
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
