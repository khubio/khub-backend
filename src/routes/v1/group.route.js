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
  .get(auth(), validate(groupValidation.getGroupDetailsById), allowLeastRoleInGroup(), groupController.getGroupDetailsById)
  .delete(auth(), validate(groupValidation.deleteGroup), allowLeastRoleInGroup('owner'), groupController.deleteGroup);

router.get(
  '/:groupId/role',
  auth(),
  validate(groupValidation.getGroupDetailsById),
  allowLeastRoleInGroup(),
  groupController.getRolInGroup
);
router.post(
  '/:groupId/invite-by-email',
  validate(groupValidation.getGroupDetailsById),
  auth(),
  allowLeastRoleInGroup('owner'),
  groupController.invitePersonToGroup
);

router
  .route('/:groupId/join')
  .get(auth(), validate(groupValidation.getGroupDetailsById), groupController.groupJoin)
  .post(auth(), validate(groupValidation.getGroupDetailsById), groupController.joinGroup);

router
  .route('/:groupId/members')
  .patch(
    auth(),
    validate(groupValidation.updateUserGroupById),
    allowLeastRoleInGroup('owner'),
    groupController.updateUserGroupById
  )
  .delete(
    auth(),
    validate(groupValidation.deleteUserGroupById),
    allowLeastRoleInGroup('owner'),
    groupController.deleteUserGroupById
  );

module.exports = router;
