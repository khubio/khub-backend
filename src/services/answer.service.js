const httpStatus = require('http-status');
const { Slide, Answer } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a answer
 * @param {Object} answerBody
 * @return {Promise<Slide>}
 */
const createAnswer = async (answerBody) => {
  const answer = await Answer.create(answerBody);
  await Slide.findByIdAndUpdate(answerBody.slide, {
    $push: {
      answers: answer._id,
    },
  });
  return answer;
};

/**
 *
 * @param {string} slideId
 * @returns {Promise<QueryResult>}
 */
const getAnswersBySlideId = async (slideId) => {
  const answers = await Answer.find({}).populate({
    path: 'Slide',
    match: {
      slide: slideId,
    },
  });
  return answers;
};

/**
 * Get answer by id
 * @param {ObjectId} id
 * @return {Promise<Answer>}
 */
const getAnswerById = async (id) => {
  const answer = await Answer.findById(id).populate({
    path: 'slide',
  });
  return answer;
};

/**
 * update answer by id
 * @param {String} id
 * @param {Object} updateBody
 * @returns {Promise<Answer>}
 */
const updateAnswerById = async (id, updateBody) => {
  const answer = await getAnswerById(id);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }

  Object.assign(answer, updateBody);
  await answer.save();
  return answer;
};

/**
 * Delete answer by id
 * @param {String} id
 * @returns {Promise<Answer>}
 */
const deleteAnswerById = async (id) => {
  const answer = await getAnswerById(id);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }
  await answer.remove();
  return answer;
};

module.exports = {
  createAnswer,
  getAnswerById,
  updateAnswerById,
  getAnswersBySlideId,
  deleteAnswerById,
};
