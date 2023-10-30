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
  review: 'This totally is not my own spot!',
  stars: 5
},
{
  spotId: 2,
  userId: 3,
  review: 'Really great!',
  stars: 4
},
{
  spotId: 3,
  userId: 4,
  review: 'Love the view!',
  stars: 3
},
{
  spotId: 1,
  userId: 5,
  review: 'Cool!',
  stars: 4
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
      userId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
