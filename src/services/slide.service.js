const httpStatus = require('http-status');
const { Slide, Presentation, Answer } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a slide
 * @param {Object} slideBody
 * @return {Promise<Slide>}
 */
const createSlide = async (slideBody) => {
  const { answers, ...slide } = slideBody;
  const newSlide = await Slide.create(slide);
  await Presentation.findByIdAndUpdate(slide.presentation, {
    $push: {
      slides: newSlide._id,
    },
  });
  await Promise.all(
    answers.map((answer) =>
      Answer.create({
        slide: newSlide._id,
        text: answer.text,
        status: answer.status,
      })
    )
  );
  return newSlide;
};

/**
 *
 * @param {string} presentationId
 * @returns {Promise<QueryResult>}
 */
const getSlidesByPresentationId = async (presentationId) => {
  const slides = await Slide.find({}).populate({
    path: 'presentation',
    match: {
      user: presentationId,
    },
  });
  return slides;
};

/**
 * Get Slide by id
 * @param {ObjectId} id
 * @return {Promise<Slide>}
 */
const getSlideById = async (id) => {
  const slide = await Slide.findById(id).populate({
    path: 'answers',
  });
  return slide;
};

/**
 * update slide by id
 * @param {String} id
 * @param {Object} updateBody
 * @returns {Promise<Slide>}
 */
const updateSlideById = async (id, updateBody) => {
  const slide = await getSlideById(id);
  if (!slide) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Slide not found');
  }

  Object.assign(slide, updateBody);
  await slide.save();
  return slide;
};

/**
 * Delete slide by id
 * @param {String} id
 * @returns {Promise<Slide>}
 */
const deleteSlideById = async (id) => {
  const slide = await getSlideById(id);
  if (!slide) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Slide not found');
  }
  await slide.remove();
  return slide;
};

module.exports = {
  createSlide,
  getSlidesByPresentationId,
  getSlideById,
  updateSlideById,
  deleteSlideById,
};
