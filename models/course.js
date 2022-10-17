'use strict';

const Sequelize = require('sequelize');

module.exports = sequelize => {
  class Course extends Sequelize.Model {}

  Course.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: "Title is required"
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: "Description is required"
      }
    },
    estimatedTime: Sequelize.STRING,
    materialsNeeded: Sequelize.STRING,
    userId: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: "User ID is required"
      }
    }
  },
  {
    scopes: {
      isOwner(courseId, currentUserId) {
        return {
          where: { [Sequelize.Op.and]: [{ id: courseId }, { userId: currentUserId }] }
        }
      }
    },
    sequelize
  });

  Course.associate = models => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      }
    });
  }

  return Course;
};