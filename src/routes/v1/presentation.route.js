const express = require('express');
const validate = require('../../middlewares/validate');
const { presentationController, participantController, slideController } = require('../../controllers');
const { presentationValidation, participantValidation, slideValidation } = require('../../validations');
const auth = require('../../middlewares/auth');

const router = express.Router();

// presentation
router
  .route('/')
  .get(auth(), validate(presentationValidation.getPresentations), presentationController.getPresentations)
  .post(auth(), validate(presentationValidation.createPresentation), presentationController.createPresentation);

router
  .route('/:presentationId')
  .get(validate(presentationValidation.getPresentationById), presentationController.getPresentationById)
  .patch(validate(presentationValidation.updatePresentationById), presentationController.updatePresentationById)
  .delete(validate(presentationValidation.deletePresentationById), presentationController.deletePresentationById);

// slide
router
  .route('/:presentationId/slides')
  .post(validate(slideValidation.createSlides), slideController.createSlides)
  .put(validate(slideValidation.updateSlides), slideController.updateSlides)
  .delete(validate(slideValidation.deleteSlides), slideController.deleteSlides);

// participants
router
  .route('/:presentationId/participants')
  .get(
    validate(participantValidation.getParticipantsByPresentationId),
    participantController.getParticipantsByPresentationId
  )
  .post(validate(participantValidation.createParticipant), participantController.createParticipant);

router
  .route('/:presentationId/participants/:participantId')
  .get(validate(participantValidation.getParticipantById), participantController.getParticipantById)
  .delete(validate(participantValidation.deleteParticipantById), participantController.deleteParticipantById);

module.exports = router;
