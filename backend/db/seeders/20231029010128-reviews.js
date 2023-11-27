'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Reviews'

const { Review } = require('../models')

const reviews = [{
  spotId: 1,
  userId: 2,
  review: 'We had a great time at this spot!',
  stars: 5
},
{
  spotId: 2,
  userId: 3,
  review: 'Really great, we enjoyed our stay!',
  stars: 4
},
{
  spotId: 3,
  userId: 4,
  review: 'Love the view, but needs some maintenance.',
  stars: 3
},
{
  spotId: 1,
  userId: 8,
  review: 'Cool spot with some good amenities.',
  stars: 4
},
{
  spotId: 1,
  userId: 3,
  review: 'Had a great time! One of the best spots out there.',
  stars: 5
},
{
  spotId: 3,
  userId: 3,
  review: 'I really enjoyed my booking at this spot, but it was too loud',
  stars: 4
},
{
  spotId: 1,
  userId: 5,
  review: "I can't recommend it enough. From our first day to our last we loved this spot.",
  stars: 5
},
{
  spotId: 4,
  userId: 5,
  review: "The location can't be beat and the view is amazing. That said, the images don't really convey how small the spot it.",
  stars: 4
},
{
  spotId: 5,
  userId: 6,
  review: "The location can't be beat and the view is amazing. That said, the images don't really convey how small the spot it.",
  stars: 4
},
{
  spotId: 5,
  userId: 1,
  review: "This spot smelled but the area is nice",
  stars: 3
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
    await Review.bulkCreate(reviews, { validate: true })
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
      userId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] }
    }, {});
  }
};
