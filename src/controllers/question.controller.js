const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { questionService } = require('../services');

const getQuestions = catchAsync(async (req, res) => {
  const { presentationId } = req.params;
  const questions = await questionService.getQuestions(presentationId);
  res.send(questions);
});

const createQuestion = catchAsync(async (req, res) => {
  const { username, text, userId } = req.body;
  const { presentationId } = req.params;
  const question = await questionService.createQuestion(presentationId, text, username, userId || null);
  res.status(httpStatus.CREATED).send(question);
});

const updateQuestion = catchAsync(async (req, res) => {
  const { questionId } = req.params;
  const question = await questionService.updateQuestion(questionId, req.body);
  res.send(question);
});

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
};
