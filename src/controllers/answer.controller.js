const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { answerService } = require('../services');

const createAnswers = catchAsync(async (req, res) => {
  const slide = req.params.slideId;
  const { answers } = req.body;
  const newAnswers = await Promise.all(
    answers.map((answer) =>
      answerService.createAnswer({
        text: answer.text,
        status: answer.status,
        slide,
      })
    )
  );
  res.status(httpStatus.CREATED).send(newAnswers);
});

const deleteAnswers = catchAsync(async (req, res) => {
  const { answers } = req.body;
  const deletedAnswers = await Promise.all(answers.map((answer) => answerService.deleteAnswerById(answer)));
  res.send(deletedAnswers);
});

const updateAnswers = catchAsync(async (req, res) => {
  const { answers } = req.body;
  const updatedAnswers = await Promise.all(
    answers.map((answer) =>
      answerService.updateAnswerById(answer.id, {
        text: answer.text,
        status: answer.status,
      })
    )
  );
  res.send(updatedAnswers);
});

module.exports = {
  createAnswers,
  deleteAnswers,
  updateAnswers,
};
