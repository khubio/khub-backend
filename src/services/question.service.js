const { Question } = require('../models');

const getQuestions = async (presentationId) => {
  const questions = await Question.find({ presentation: presentationId }).sort({ createdAt: -1 });
  return questions;
};

const createQuestion = async (presentationId, message, username, userId = null) => {
  const question = await Question.create({
    presentation: presentationId,
    message,
    username,
    user: userId,
  });
  return question;
};

const updateQuestion = async (questionId, questionBody) => {
  const question = await Question.findByIdAnUpdate(questionId, questionBody);
  return question;
};

exports.module = {
  getQuestions,
  createQuestion,
  updateQuestion,
};
