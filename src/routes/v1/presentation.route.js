const express = require('express');
const validate = require('../../middlewares/validate');
const { presentationController, participantController, slideController, answerController } = require('../../controllers');
const { presentationValidation, participantValidation, slideValidation, answerValidation } = require('../../validations');
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
  .get(validate(slideValidation.getSlidesByPresentationId), slideController.getSlidesByPresentationId)
  .post(validate(slideValidation.createSlide), slideController.createSlide);

router
  .route('/:presentationId/slides/:slideId')
  .get(validate(slideValidation.getSlideById), slideController.getSlideById)
  .patch(validate(slideValidation.updateSlideById), slideController.updateSlideById)
  .delete(validate(slideValidation.deleteSlideById), slideController.deleteSlideById);

// answers
router
  .route('/:presentationId/slides/:slideId/answers')
  .get(validate(answerValidation.getAnswersBySlideId), answerController.getAnswersBySlideId)
  .post(validate(answerValidation.createAnswer), answerController.createAnswer);

router
  .route('/:presentationId/slides/:slideId/answers/:answerId')
  .get(validate(answerValidation.getAnswerById), answerController.getAnswerById)
  .patch(validate(answerValidation.updateAnswerById), answerController.updateAnswerById)
  .delete(validate(answerValidation.deleteAnswerById), answerController.deleteAnswerById);

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
