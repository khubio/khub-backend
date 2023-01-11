/* eslint-disable prettier/prettier */
const express = require('express');
const validate = require('../../middlewares/validate');
const { presentationController, slideController, answerController, chatController, questionController } = require('../../controllers');
const { presentationValidation, slideValidation } = require('../../validations');
const allowAccessPresentation = require('../../middlewares/allowAccessPresentation');
const auth = require('../../middlewares/auth');

const router = express.Router();

// presentation
router
  .route('/')
  .get(auth(), validate(presentationValidation.getPresentations), presentationController.getPresentations)
  .post(auth(), validate(presentationValidation.createPresentation), presentationController.createPresentation);

router
  .route('/:presentationId')
  .get(auth(), validate(presentationValidation.getPresentationById), allowAccessPresentation(), presentationController.getPresentationById)
  .patch(auth(), validate(presentationValidation.updatePresentationById), presentationController.updatePresentationById)
  .delete(auth(), validate(presentationValidation.deletePresentationById), presentationController.deletePresentationById);

router.post('/:presentationId/collaborators/add', auth(), presentationController.addCollaborator);
router.post('/:presentationId/collaborators/delete', auth(), presentationController.removeCollaborator);
// slide
router
  .route('/:presentationId/slides')
  .post(auth(), slideController.createSlides)
  .put(auth(), slideController.updateSlides)
  .delete(auth(), validate(slideValidation.deleteSlides), slideController.deleteSlides);

router
  .route('/:presentationId/slides/:slideId/answers')
  .post(auth(), answerController.createAnswers)
  .delete(auth(), answerController.deleteAnswers)
  .put(auth(), answerController.updateAnswers);

router
  .route(auth(),'/:presentationId/chats')
  .get(auth(),chatController.getChats)
  .post(auth(),chatController.createChat);

router
  .route('/:presentationId/questions')
  .get(questionController.getQuestions)
  .post(questionController.createQuestion)
  .put(questionController.updateQuestion);

module.exports = router;
