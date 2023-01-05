const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { groupService, userGroupService, emailService } = require('../services');

const createGroup = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;
  const { name } = req.body;
  const group = await groupService.createGroup({ name });
  const groupId = group._id;
  await userGroupService.createUserGroup({
    group: groupId,
    user: userId,
    role: 'owner',
  });
  res.status(httpStatus.CREATED).send(group);
});

const updateGroupById = catchAsync(async (req, res) => {
  const group = await groupService.updateGroupById(req.params.groupId, req.body);
  res.send(group);
});

const createUserGroup = catchAsync(async (req, res) => {
  const userGroup = await userGroupService.createUserGroup(req.body);
  res.status(httpStatus.CREATED).send(userGroup);
});

const getGroups = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const results = await groupService.queryGroups(filter, options);
  res.send(results);
});

const getGroupsByUserId = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;
  const { roles } = req.query;
  const groups = await groupService.getGroupsByUserId(userId, roles.split(','));
  res.send(groups);
});

const getGroupById = catchAsync(async (req, res) => {
  const { roles } = req.query;
  const group = await groupService.getGroupById(req.params.groupId, roles.split(','));
  res.send(group);
});

const getGroupOwner = catchAsync(async (req, res) => {
  const groupOwner = await userGroupService.getGroupOwner(req.params.groupId);
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

const deleteUserGroupById = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  await userGroupService.deleteUserGroupById(userId, groupId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const members = await userGroupService.queryMembers(groupId);

  await Promise.all(members.map((member) => userGroupService.deleteUserGroupById(groupId, member._id)));
  await groupService.deleteGroupById(groupId);
  res.status(httpStatus.NO_CONTENT).send();
});

const promoteMemberToCoOwner = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  await userGroupService.updateUserGroupById(userId, groupId, { role: 'coOwner' });
  res.status(httpStatus.NO_CONTENT).send();
});

const demoteCoOwnerToMember = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  await userGroupService.updateUserGroupById(userId, groupId, { role: 'member' });
  res.status(httpStatus.NO_CONTENT).send();
});

const kickMember = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  await userGroupService.deleteUserGroupById(userId, groupId);
  res.status(httpStatus.NO_CONTENT).send();
});

const invitePersonToGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { _id: userId } = req.user;
  const { email } = req.body;

  const isGroupOwner = await userGroupService.isGroupOwner(userId, groupId);
  if (!isGroupOwner) {
    res.status(httpStatus.UNAUTHORIZED).send({ error: `Cannot invite because user is not owner's group` });
  } else {
    const emailMembers = await userGroupService.getEmailMembers(groupId);
    if (emailMembers.includes(email)) {
      res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ message: `Member is already in this group` });
    } else {
      await emailService.sendInvitationEmail(email, groupId);
      res.status(httpStatus.NO_CONTENT).send();
    }
  }
});

const checkUserInGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { _id: userId } = req.user;

  const isJoinedGroup = await userGroupService.isJoinedGroup(userId, groupId);
  res.send(isJoinedGroup);
});

module.exports = {
  createGroup,
  createUserGroup,
  getGroups,
  getGroupsByUserId,
  getGroupById,
  getGroupOwner,
  queryMembers,
  updateUserGroupById,
  deleteUserGroupById,
  deleteGroup,
  updateGroupById,
  promoteMemberToCoOwner,
  demoteCoOwnerToMember,
  kickMember,
  invitePersonToGroup,
  checkUserInGroup,
};
