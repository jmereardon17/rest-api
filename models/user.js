'use strict';

const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = sequelize => {
  class User extends Sequelize.Model {}

  User.init({
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name is required'
        }
      }
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name is required'
        }
      }
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        msg: 'The email address you entered already exists',
      },
      validate: {
        notEmpty: 'Email address is required',
        isEmail: {
          msg: 'Email address must be valid'
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      set(val) {
        if (val) {
          this.setDataValue('password', bcryptjs.hashSync(val, 10));
        }
      },
      validate: {
        notEmpty: 'Password is required'
      }
    },
  }, 
  { 
    // defaultScope: {
    //   attributes: {
    //     exclude: ['password', 'createdAt', 'updatedAt']
    //   }
    // },
    scopes: {
      existingUser: {
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      }
    },
    sequelize 
  });

  User.associate = models => {
    User.hasMany(models.Course, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      }
    });
  }

  return User;
};