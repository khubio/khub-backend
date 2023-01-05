const httpStatus = require('http-status');
const { Group, UserGroup } = require('../models');
const ApiError = require('../utils/ApiError');
const userGroupService = require('./usergroup.service');

/**
 * Create a group
 * @param {Object} groupBody
 * @return {Promise<Group>}
 */
const createGroup = async (groupBody) => {
  return Group.create(groupBody);
};

/**
 *
 * @param {string} userId
 * @returns {Promise<QueryResult>}
 */
const getGroupsByUserId = async (userId, roles) => {
  const groups = await UserGroup.find({
    user: userId,
    role: { $in: roles },
  })
    .select('role')
    .populate({
      path: 'group',
      options: { lean: true },
    })
    .lean();
  const data = groups.map((group) => {
    return {
      id: group.group._id,
      name: group.group.name,
      role: group.role,
    };
  });
  return data;
};

/**
 * Get group by id
 * @param {ObjectId} id
 * @return {Promise<Group>}
 */

const getGroupById = (id) => {
  return Group.findById(id);
};

const getGroupDetailsById = async (id, roles) => {
  const group = await Group.findById(id)
    .populate({
      path: 'users',
      populate: {
        path: 'user',
        select: 'firstName lastName email',
      },
    })
    .lean();
  const formatUsers = group.users.map((user) => {
    return {
      id: user.user._id,
      role: user.role,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      email: user.user.email,
    };
  });

  const filterUsers = formatUsers.filter((user) => roles.includes(user.role));

  const { users, _id, ...rest } = group;
  return {
    ...rest,
    users: filterUsers,
    id: _id,
  };
};

/**
 * Delete group by id
 * @param {String} groupId
 * @returns {Promise<Group>}
 */
const deleteGroupById = async (groupId) => {
  const group = await getGroupById(groupId);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  await userGroupService.deleteUserGroupsByGroupId(groupId);
  await group.remove();
  return group;
};

module.exports = {
  createGroup,
  getGroupsByUserId,
  getGroupById,
  getGroupDetailsById,
  deleteGroupById,
};
