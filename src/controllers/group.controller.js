const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { groupService, userGroupService } = require('../services');

const createGroup = catchAsync(async (req, res) => {
  const { name, members } = req.body;
  const group = await groupService.createGroup({ name });
  const groupId = group._id;

  await Promise.all(members.map(async (member) => {
    return await userGroupService.createUserGroup({
      group: groupId,
      user: member.userId,
      role: member.role,
    });
  }));

  res.status(httpStatus.CREATED).send(group);
});

const createUserGroup = catchAsync(async (req, res) => {
  const userGroup = await userGroup.createUserGroup(req.body);
  res.status(httpStatus.CREATED).send(userGroup);
})

const getGroups = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const results = await groupService.queryGroups(filter, options);
  res.send(results);
});

const getGroupOwner = catchAsync(async (req, res) => {
  const groupOwner = await groupService.getGroupOwner(req.params.groupId);
  res.send(groupOwner);
});

const queryMembers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const results = await userGroupService.queryMembers(filter, options);
  res.send(results);
});

const updateUserGroupById = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId, ...updateBody } = req.body;
  const userGroup = await userGroupService.updateUserGroupById(userId, groupId, updateBody);
  res.send(userGroup);
});

const deleteUserGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body
  await userGroupService.deleteUserGroupById(userId, groupId);
  res.status(httpStatus.NO_CONTENT).send();
})

const deleteGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const members = await userGroupService.queryMembers(groupId);

  await Promise.all(members.map(async (member) => await userGroupService.deleteUserGroupById(groupId, member._id)));
  await groupService.deleteGroupById(groupId);
  res.status(httpStatus.NO_CONTENT).send();
})

module.exports = {
  createGroup,
  createUserGroup,
  getGroups,
  getGroupOwner,
  queryMembers,
  updateUserGroupById,
  deleteUserGroup,
  deleteGroup,
}
