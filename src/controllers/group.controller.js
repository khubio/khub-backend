const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { groupService, userGroupService, emailService } = require('../services');
const { Group } = require('../models');

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

const createUserGroup = catchAsync(async (req, res) => {
  const userGroup = await userGroupService.createUserGroup(req.body);
  res.status(httpStatus.CREATED).send(userGroup);
});

const getGroupsByUserId = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;
  const { roles } = req.query;
  const groups = await groupService.getGroupsByUserId(userId, roles.split(','));
  res.send(groups);
});

const getGroupDetailsById = catchAsync(async (req, res) => {
  const { roles } = req.query;
  const group = await groupService.getGroupDetailsById(req.params.groupId, roles.split(','));
  res.send(group);
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
  await groupService.deleteGroupById(groupId);
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

const groupJoin = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { _id: userId } = req.user;

  const [isJoinedGroup, group] = await Promise.all([
    userGroupService.isJoinedGroup(userId, groupId),
    Group.findById(groupId).select('name'),
  ]);
  res.send({ isJoinedGroup, group });
});

const joinGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { _id: userId } = req.user;
  const isJoinedGroup = await userGroupService.isJoinedGroup(userId, groupId);
  if (!isJoinedGroup) {
    const userGroup = await userGroupService.createUserGroup({
      user: userId,
      group: groupId,
      role: 'member',
    });
    res.status(httpStatus.CREATED).send(userGroup);
    return;
  }
  res.status(httpStatus.UNPROCESSABLE_ENTITY).send();
});

const getRolInGroup = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const { _id: userId } = req.user;
  const userGroup = await userGroupService.getUserGroupById(userId, groupId);
  const { role } = userGroup;
  res.send(role);
});

module.exports = {
  createGroup,
  createUserGroup,
  getGroupsByUserId,
  getGroupDetailsById,
  updateUserGroupById,
  deleteUserGroupById,
  deleteGroup,
  invitePersonToGroup,
  groupJoin,
  joinGroup,
  getRolInGroup,
};
