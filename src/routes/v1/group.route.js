const express = require('express');
const { groupController } = require('../../controllers');
const router = express.Router();

router.
  route('/create')
  .post(groupController.createGroup);

router
  .route('/:groupId/groupOwner')
  .get(groupController.getGroupOwner);

module.exports = router;
