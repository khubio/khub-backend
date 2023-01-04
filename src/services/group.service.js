const httpStatus = require('http-status');
const { Group, UserGroup } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a group
 * @param {Object} groupBody
 * @return {Promise<Group>}
 */
const createGroup = async (groupBody) => {
  return Group.create(groupBody);
};

/**
 * Query for groups
 * @param {Object} filter
 * @param {Object} options
 * @param {string} [options.sortBy]
 * @param {number} [options.limit]
 * @param {number} [options.page]
 * @return {Promise<QueryResult>}
 */
const queryGroups = async (filter, options) => {
  const groups = await Group.paginate(filter, options);
  return groups;
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
const getGroupById = async (id) => {
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

  const { users, ...rest } = group;
  return {
    ...rest,
    users: formatUsers,
  };
};

/**
 * update group by id
 * @param {String} id
 * @param {Object} updateBody
 * @returns {Promise<Group>}
 */
const updateGroupById = async (id, updateBody) => {
  const group = await getGroupById(id);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }

  Object.assign(group, updateBody);
  await group.save();
  return group;
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
  await group.remove();
  return group;
};

const promoteMemberToCoOwner = async (groupId, userId) => {
  const userGroup = await UserGroup.findOneAndUpdate(
    {
      userId,
      groupId,
    },
    {
      role: 'coOwner',
    }
  );
  return userGroup;
};

module.exports = {
  createGroup,
  queryGroups,
  getGroupsByUserId,
  getGroupById,
  updateGroupById,
  deleteGroupById,
  promoteMemberToCoOwner,
};
