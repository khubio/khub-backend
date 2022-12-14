const express = require('express');
const validate = require('../../middlewares/validate');
const { slideController } = require('../../controllers');
const { slideValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .get(validate(slideValidation.getSlidesByPresentationId), slideController.getSlidesByPresentationId)
  .post(validate(slideValidation.createSlide), slideController.createSlide);

router
  .route('/:slideId')
  .get(validate(slideValidation.getSlideById), slideController.getSlideById)
  .patch(validate(slideValidation.updateSlideById), slideController.updateSlideById)
  .delete(validate(slideValidation.deleteSlideById), slideController.deleteSlideById);
module.exports = router;
