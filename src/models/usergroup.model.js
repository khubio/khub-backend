const mongoose = require('mongoose');
const { groupRoles } = require('../config/roles');

const userGroupSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    group: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Group',
    },
    role: {
      type: String,
      enum: groupRoles,
      default: 'member',
    }
  },
  {
    timeStamps: true,
  }
);

const UserGroup = mongoose.model('UserGroup', userGroupSchema);
module.exports = UserGroup;
