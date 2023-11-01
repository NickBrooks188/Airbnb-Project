'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Spots'

const { Spot } = require('../models')

const spots = [{
  ownerId: 1,
  address: '123 Fake st',
  city: 'Los Angeles',
  state: 'CA',
  country: 'US',
  lat: 43.5,
  lng: 54.7,
  name: 'My spot',
  description: 'my favorite spot',
  price: 45.00
},
{
  ownerId: 1,
  address: '555 Grove st',
  city: 'New York City',
  state: 'NY',
  country: 'US',
  lat: 63.5,
  lng: 94.7,
  name: 'My second spot',
  description: 'my second favorite spot',
  price: 60.00
},
{
  ownerId: 1,
  address: '777 Mystery st',
  city: 'Chicago',
  state: 'IL',
  country: 'US',
  lat: 61.6,
  lng: 74.2,
  name: 'My third spot',
  description: 'my third favorite spot',
  price: 35.50
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

    await Spot.bulkCreate(spots, { validate: true })
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
      name: { [Op.in]: ['My spot', 'My second spot', 'My third spot'] }
    }, {});
  }
};
