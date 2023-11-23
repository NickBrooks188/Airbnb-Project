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
  country: 'United States',
  lat: 43.5,
  lng: 54.7,
  name: 'Place with a view',
  description: 'Close to downtown Los Angeles, this spot has everything you need.',
  price: 145.00
},
{
  ownerId: 1,
  address: '555 Grove st',
  city: 'New York City',
  state: 'NY',
  country: 'United States',
  lat: 63.5,
  lng: 94.7,
  name: 'New building with lots of space',
  description: 'In the heart of New York, this spot is sure to be loved by everyone.',
  price: 219.99
},
{
  ownerId: 1,
  address: '777 Mystery st',
  city: 'Chicago',
  state: 'IL',
  country: 'United States',
  lat: 61.6,
  lng: 74.2,
  name: 'Chicago spot',
  description: 'Explore the city from this spot with a great location.',
  price: 120.50
},
{
  ownerId: 2,
  address: '777 test st',
  city: 'San Diego',
  state: 'CA',
  country: 'United States',
  lat: 35.2,
  lng: 34.7,
  name: 'Spot by the beach',
  description: "Close to the beach with great walkability",
  price: 85.50
},
{
  ownerId: 3,
  address: '777 lombard st',
  city: 'San Francisco',
  state: 'CA',
  country: 'United States',
  lat: 37.2,
  lng: 32.7,
  name: 'Tech spot',
  description: "Close to the golden gate bridge, everyone loves this spot!",
  price: 179.99
},
{
  ownerId: 4,
  address: '24601 Sunset blvd',
  city: 'Austin',
  state: 'TX',
  country: 'United States',
  lat: 27.2,
  lng: 42.7,
  name: 'Texas spot',
  description: "Great spot with access to lots of public transportation",
  price: 125.00
},
{
  ownerId: 5,
  address: '14 Whaler st',
  city: 'Boston',
  state: 'MA',
  country: 'United States',
  lat: 68.3,
  lng: 41.6,
  name: 'Summer spot',
  description: "New building with great lighting",
  price: 100.00
},
{
  ownerId: 6,
  address: '555 Main st',
  city: 'Atlanta',
  state: 'GA',
  country: 'United States',
  lat: 65.3,
  lng: 32.2,
  name: 'Heart of Atlanta',
  description: "Many amenities and ample parking.",
  price: 84.50
},
{
  ownerId: 7,
  address: '60 Mariner rd',
  city: 'Seattle',
  state: 'WA',
  country: 'United States',
  lat: 55.3,
  lng: 12.5,
  name: 'Rainy spot',
  description: "If you like the rain, this spot is perfect for you.",
  price: 75.25
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
      ownerId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] }
    }, {});
  }
};
