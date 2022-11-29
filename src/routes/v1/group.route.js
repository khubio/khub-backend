const express = require('express');
const validate = require('../../middlewares/validate');
const { groupController } = require('../../controllers');
const { groupValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .get(validate(groupValidation.getGroupsByUserId), groupController.getGroupsByUserId)
  .post(validate(groupValidation.createGroup), groupController.createGroup);

router
  .route('/:groupId')
  .get(validate(groupValidation.getGroupById), groupController.getGroupById)
  .patch(validate(groupValidation.updateGroup), groupController.updateGroupById);

router.route('/:groupId/members').get(groupController.queryMembers);
router.route('/:groupId/groupOwner').get(groupController.getGroupOwner);

module.exports = router;
