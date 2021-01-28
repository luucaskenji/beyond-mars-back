const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Photo extends Sequelize.Model { };

Photo.init(
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        likes: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'photo'
    }
);

module.exports = Photo;