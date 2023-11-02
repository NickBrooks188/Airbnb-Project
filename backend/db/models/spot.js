'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: 'spotId',
        otherKey: 'userId'
      })

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        // onDelete: 'CASCADE'
      })

      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'Owner'
      })

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        // onDelete: 'CASCADE'
      })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        properRange(value) {
          if (value < -90 || value > 90) {
            throw new Error('Latitude is not valid')
          }
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        properRange(value) {
          if (value < -180 || value > 180) {
            throw new Error('Longitude is not valid')
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notLongerThan50(value) {
          if (value.length > 50) throw new Error('Name must be less than 50 characters')
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt']
    }
  });
  return Spot;
};