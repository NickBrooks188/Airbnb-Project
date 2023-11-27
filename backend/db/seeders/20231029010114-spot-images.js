'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'SpotImages'

const { SpotImage } = require('../models')

const spotImages = [{
  spotId: 1,
  url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/20190616154621%21Echo_Park_Lake_with_Downtown_Los_Angeles_Skyline.jpg',
  preview: true
}, {
  spotId: 2,
  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1200px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
  preview: true
}, {
  spotId: 3,
  url: 'https://cdn.choosechicago.com/uploads/2022/06/wygyk-agnostic-A.Alexander_5cloudgateMay13-scaled.jpg',
  preview: true
}, {
  spotId: 1,
  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/LA_Downtown_View_%28cropped%29.jpg/800px-LA_Downtown_View_%28cropped%29.jpg',
  preview: false
}, {
  spotId: 1,
  url: 'https://cdn.britannica.com/22/154122-050-B1D0A7FD/Skyline-Los-Angeles-California.jpg',
  preview: false
}, {
  spotId: 1,
  url: 'https://lacounty.gov/wp-content/uploads/2022/03/shutterstock_1418018357-scaled.jpg',
  preview: false
}, {
  spotId: 1,
  url: 'https://www.nationsonline.org/gallery/USA/Hollywood-sign.jpg',
  preview: false
}, {
  spotId: 2,
  url: 'https://www.state.gov/wp-content/uploads/2022/01/shutterstock_248799484-scaled.jpg',
  preview: false
}, {
  spotId: 2,
  url: 'https://cdn.tiqets.com/wordpress/blog/wp-content/uploads/2017/08/03134557/24-hours-in-new-york-1.jpg',
  preview: false
}, {
  spotId: 2,
  url: 'https://travellemming.com/wp-content/uploads/Best-Time-to-Visit-New-York-City.jpg',
  preview: false
}, {
  spotId: 3,
  url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/df/65/c1/caption.jpg?w=1200&h=-1&s=1',
  preview: false
}, {
  spotId: 3,
  url: 'https://www.fodors.com/wp-content/uploads/2019/05/WhatNOTtodoinChicago__HERO_iStock-996188444.jpg',
  preview: false
}, {
  spotId: 3,
  url: 'https://chicagorti.org/app/uploads/2021/07/hero-3-scaled-1920x999.75-c-default.jpg',
  preview: false
}, {
  spotId: 3,
  url: 'https://www.northcentralcollege.edu/sites/default/files/styles/full_image_large/public/chicago_full_image.jpg?h=c1eb06c9&itok=q7OL573H',
  preview: false
}, {
  spotId: 4,
  url: 'https://www.tripsavvy.com/thmb/N-x2D3GHrDriLXo8QK8p0m99p2I=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/sunset-at-la-jolla-cove-1278353139-583584d99afb438a9889e8d381b836ed.jpg',
  preview: true
}, {
  spotId: 4,
  url: 'https://www.extraspace.com/blog/wp-content/uploads/2019/03/things-to-know-san-diego.jpg',
  preview: false
}, {
  spotId: 4,
  url: 'https://www.visittheusa.com/sites/default/files/styles/hero_l/public/images/hero_media_image/2023-06/c2d224fc-fbbb-40c9-8603-6704536bafb5_0.jpeg?h=6d51aebd&itok=vmSoQmMS',
  preview: false
}, {
  spotId: 4,
  url: 'https://a.cdn-hotels.com/gdcs/production72/d278/15f87a8d-c829-45bb-bec6-708a333de504.jpg?impolicy=fcrop&w=800&h=533&q=medium',
  preview: false
}, {
  spotId: 4,
  url: 'https://www.visittheusa.com/sites/default/files/styles/hero_l/public/images/hero_media_image/2016-11/Hero_San%20Diego%20Skyline_John%20Bahu.jpg?h=3767f04f&itok=ULC4UclZ',
  preview: false
}, {
  spotId: 5,
  url: 'https://media.cntraveler.com/photos/648397a56702ed16faad7a3b/3:2/w_1600%2Cc_limit/San%2520Francisco%2520Things%2520to%2520Do%2520UPDATE_GettyImages-1406939930.jpg',
  preview: true
}, {
  spotId: 5,
  url: 'https://www.qantas.com/content/travelinsider/en/explore/north-america/usa/san-francisco/what-not-to-do-in-san-francisco/_jcr_content/parsysTop/hero.img.full.medium.jpg/1538957665734.jpg',
  preview: false
}, {
  spotId: 5,
  url: 'https://travel.usnews.com/dims4/USNEWS/df9b4eb/2147483647/resize/600x400%5E%3E/crop/600x400/quality/85/?url=https%3A%2F%2Ftravel.usnews.com%2Fimages%2Fgettyimages-123318669_UboMiEL.jpg',
  preview: false
}, {
  spotId: 5,
  url: 'https://i.guim.co.uk/img/media/6458c81aaa7d5481f86f680b5bdd9571d572eee8/0_0_6720_4480/master/6720.jpg?width=465&dpr=1&s=none',
  preview: false
}, {
  spotId: 5,
  url: 'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/476000/476367-Downtown-San-Francisco.jpg',
  preview: false
}, {
  spotId: 6,
  url: 'https://texashillcountryoliveco.com/cdn/shop/articles/the-perfect-itinerary-for-3-days-in-austin-tx-a-locals-guide-776189.jpg?v=1681827891',
  preview: true
}, {
  spotId: 7,
  url: 'https://www.visittheusa.com/sites/default/files/styles/hero_l/public/images/hero_media_image/2017-01/HERO_GettyImages-542201276_Web72DPI.jpg?h=119335f7&itok=_n7H4utA',
  preview: true
}, {
  spotId: 8,
  url: 'https://www.getawaymavens.com/wp-content/uploads/2019/01/Westin-Peachtree-Atlanta.jpg',
  preview: true
}, {
  spotId: 9,
  url: 'https://media.king5.com/assets/KING/images/1073c173-b118-49e7-affa-40ae7f5b2228/1073c173-b118-49e7-affa-40ae7f5b2228_1140x641.jpg',
  preview: true
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
    await SpotImage.bulkCreate(spotImages, { validate: true })
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
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
