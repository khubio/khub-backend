const express = require('express');
const validate = require('../../middlewares/validate');
const { groupController } = require('../../controllers');
const { groupValidation } = require('../../validations');
const auth = require('../../middlewares/auth');
const allowLeastRoleInGroup = require('../../middlewares/allowLeastRoleInGroup');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(groupValidation.getGroupsByUserId), groupController.getGroupsByUserId)
  .post(auth(), validate(groupValidation.createGroup), groupController.createGroup);

router
  .route('/:groupId')
  .get(auth(), validate(groupValidation.getGroupById), allowLeastRoleInGroup(), groupController.getGroupById)
  .patch(auth(), validate(groupValidation.updateGroup), groupController.updateGroupById);

router.post('/:groupId/invite-by-email', auth(), allowLeastRoleInGroup('owner'), groupController.invitePersonToGroup);

router
  .route('/:groupId/join')
  .get(auth(), validate(groupValidation.getGroupById), groupController.groupJoin)
  .post(auth(), validate(groupValidation.getGroupById), groupController.joinGroup);

router
  .route('/:groupId/members')
  .get(auth(), groupController.queryMembers)
  .patch(auth(), validate(groupValidation.updateUserGroupById), groupController.updateUserGroupById)
  .delete(auth(), validate(groupValidation.deleteUserGroupById), groupController.deleteUserGroupById);

router.route('/:groupId/groupOwner').get(groupController.getGroupOwner);

module.exports = router;
