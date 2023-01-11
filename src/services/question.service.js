const { Question } = require('../models');

const getQuestions = async (presentationId) => {
  const questions = await Question.find({ presentation: presentationId }).sort({ createdAt: 1 });
  return questions;
};

const createQuestion = async (presentationId, text, username, userId = null) => {
  const question = await Question.create({
    presentation: presentationId,
    text,
    username,
    user: userId,
  });
  return question;
};

const updateQuestion = async (questionId, questionBody) => {
  const question = await Question.findByIdAndUpdate(questionId, questionBody, { new: true });
  return question;
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
};
