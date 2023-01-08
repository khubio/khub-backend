const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { answerService } = require('../services');

const createAnswer = catchAsync(async (req, res) => {
  const slide = req.params.slideId;
  const answer = await answerService.createAnswer({ ...req.body, slide });
  res.status(httpStatus.CREATED).send(answer);
});

const getAnswersBySlideId = catchAsync(async (req, res) => {
  const answers = await answerService.getAnswersBySlideId(req.params.slideId);
  res.send(answers);
});

const getAnswerById = catchAsync(async (req, res) => {
  const answer = await answerService.getAnswerById(req.params.answerId);
  res.send(answer);
});

const updateAnswerById = catchAsync(async (req, res) => {
  const answer = await answerService.updateAnswerById(req.params.answerId, req.body);
  res.send(answer);
});

const deleteAnswerById = catchAsync(async (req, res) => {
  const answer = await answerService.deleteAnswerById(req.params.answerId);
  res.send(answer);
});

module.exports = {
  createAnswer,
  getAnswersBySlideId,
  getAnswerById,
  updateAnswerById,
  deleteAnswerById,
};
