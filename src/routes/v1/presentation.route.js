const express = require('express');
const validate = require('../../middlewares/validate');
const { presentationController } = require('../../controllers');
const { presentationValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .get(validate(presentationValidation.getPresentationsByCreator), presentationController.getPresentationsByCreator)
  .post(validate(presentationValidation.createPresentation), presentationController.createPresentation);

router
  .route('/:presentationId')
  .get(validate(presentationValidation.getPresentationById), presentationController.getPresentationById)
  .patch(validate(presentationValidation.updatePresentationById), presentationController.updatePresentationById)
  .delete(validate(presentationValidation.deletePresentationById), presentationController.deletePresentationById);
module.exports = router;
