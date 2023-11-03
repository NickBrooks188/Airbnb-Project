'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Bookings'

const { Booking } = require('../models')

const bookings = [{
  spotId: 1,
  userId: 2,
  startDate: '2020-01-01',
  endDate: '2020-01-05'
},
{
  spotId: 2,
  userId: 2,
  startDate: '2021-01-01',
  endDate: '2021-01-04'
},
{
  spotId: 3,
  userId: 3,
  startDate: '2022-01-03',
  endDate: '2022-01-05'
},
{
  spotId: 1,
  userId: 3,
  startDate: '2025-01-01',
  endDate: '2025-01-10'
},
{
  spotId: 3,
  userId: 3,
  startDate: '2026-01-01',
  endDate: '2026-01-05'
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
