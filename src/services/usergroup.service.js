const httpStatus = require('http-status');
const { UserGroup, User, Group } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a userGroup
 * @param {Object} userGroupBody
 * @returns {Promise<UserGroup>}
 */
const createUserGroup = async (userGroupBody) => {
  const userGroup = await UserGroup.create(userGroupBody);
  await Group.findByIdAndUpdate(userGroupBody.group, {
    $push: {
      users: userGroup._id,
    },
  });
  await User.findByIdAndUpdate(userGroupBody.user, {
    $push: {
      groups: userGroup._id,
    },
  });
  return userGroup;
};

/**
 *
 * @param {String} userId
 * @param {String} groupId
 * @returns {Promise<UserGroup>}
 */
const getUserGroupById = async (userId, groupId) => {
  return UserGroup.findOne({ userId, groupId });
};

/**
 * Get group owner of a group
 * @param {String} groupId
 * @returns {Promise<User>}
 */
const getGroupOwner = async (groupId) => {
  const groupOwner = await User.findOne().populate({
    path: 'groups',
    match: {
      group: groupId,
      role: 'owner',
    },
  });
  return groupOwner;
};

/**
 * Query for members in a group
 * @param {String} groupId
 * @returns {Promise<QueryResult>}
 */
const queryMembers = async (groupId, filter, option) => {
  const member = await User.populate({
    path: 'UserGroup',
    match: {
      group: groupId,
      role: { $ne: 'blacklist' },
    },
  }).paginate(filter, option);
  return member;
};

/**
 * update userGroup by userId and groupId
 * @param {String} userId
 * @param {String} groupId
 * @param {Object} updateBody
 * @returns {Promise<UserGroup>}
 */
const updateUserGroupById = async (userId, groupId, updateBody) => {
  const userGroup = await getUserGroupById(userId, groupId);
  if (!userGroup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserGroup not found');
  }
  Object.assign(userGroup, updateBody);
  await userGroup.save();
  return userGroup;
};

/**
 * Delete userGroup by userId and groupId
 * @param {String} userId
 * @param {String} groupId
 * @returns {Promise<UserGroup>}
 */
const deleteUserGroupById = async (userId, groupId) => {
  const userGroup = await getUserGroupById(userId, groupId);
  if (!userGroup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  await userGroup.remove();
  return userGroup;
};

module.exports = {
  createUserGroup,
  getUserGroupById,
  getGroupOwner,
  queryMembers,
  updateUserGroupById,
  deleteUserGroupById,
};
