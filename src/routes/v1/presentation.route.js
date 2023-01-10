const express = require('express');
const validate = require('../../middlewares/validate');
const { presentationController, participantController, slideController, answerController } = require('../../controllers');
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
  .post(slideController.createSlides)
  .put(slideController.updateSlides)
  .delete(validate(slideValidation.deleteSlides), slideController.deleteSlides);

router
  .route('/:presentationId/slides/:slideId/answers')
  .post(answerController.createAnswers)
  .delete(answerController.deleteAnswers)
  .put(answerController.updateAnswers);

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
