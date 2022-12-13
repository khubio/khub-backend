const httpStatus = require('http-status');
const { Slide, Presentation } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a slide
 * @param {Object} slideBody
 * @return {Promise<Slide>}
 */
const createSlide = async (slideBody) => {
  const slide = await Slide.create(slideBody);
  await Presentation.findByIdAndUpdate(slideBody.presentation, {
    $push: {
      slides: slide._id,
    },
  });
  return slide;
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
  await Presentation.findByIdAndUpdate(slide.presentation, {
    $pull: {
      slides: id,
    },
  });
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
