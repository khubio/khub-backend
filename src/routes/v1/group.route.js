const express = require('express');
const validate = require('../../middlewares/validate');
const { groupController } = require('../../controllers');
const { groupValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .get(validate(groupValidation.getGroupsByUserId), groupController.getGroupsByUserId)
  .post(validate(groupValidation.createGroup), groupController.createGroup);

router.route('/:groupId/groupOwner').get(groupController.getGroupOwner);

router.route('/:groupId/members').get(groupController.queryMembers);

// router.route('/:groupId').get(groupController.get);

module.exports = router;
