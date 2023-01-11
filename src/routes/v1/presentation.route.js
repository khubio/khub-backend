/* eslint-disable prettier/prettier */
const express = require('express');
const validate = require('../../middlewares/validate');
const { presentationController, slideController, answerController, chatController, questionController } = require('../../controllers');
const { presentationValidation, slideValidation } = require('../../validations');
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

router
  .route('/:presentationId/chats')
  .get(chatController.getChats)
  .post(chatController.createChat);

router
  .route('/:presentationId/questions')
  .get(questionController.getQuestions)
  .post(questionController.createQuestion)
  .put(questionController.updateQuestion);

module.exports = router;
