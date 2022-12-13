const httpStatus = require('http-status');
const { Presentation } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a presentation
 * @param {Object} presentationBody
 * @return {Promise<Presentation>}
 */
const createPresentation = async (presentationBody) => {
  return Presentation.create(presentationBody);
};

/**
 *
 * @param {string} userId
 * @returns {Promise<QueryResult>}
 */
const getPresentationsOfCreatorByUserId = async (userId) => {
  const presentations = await Presentation.find({}).populate({
    path: 'creator',
    match: {
      user: userId,
    },
  });
  return presentations;
};

/**
 * Get presentation by id
 * @param {ObjectId} id
 * @return {Promise<Presentation>}
 */
const getPresentationById = async (id) => {
  const presentation = await Presentation.findById(id).populate({
    path: 'slides',
  });
  return presentation;
};

/**
 * update presentation by id
 * @param {String} id
 * @param {Object} updateBody
 * @returns {Promise<Presentation>}
 */
const updatePresentationById = async (id, updateBody) => {
  const presentation = await getPresentationById(id);
  if (!presentation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Presentation not found');
  }

  Object.assign(presentation, updateBody);
  await presentation.save();
  return presentation;
};

/**
 * Delete presentation by id
 * @param {String} PresentationId
 * @returns {Promise<Presentation>}
 */
const deletePresentationById = async (PresentationId) => {
  const presentation = await getPresentationById(PresentationId);
  if (!presentation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Presentation not found');
  }
  await presentation.remove();
  return presentation;
};

module.exports = {
  createPresentation,
  getPresentationsOfCreatorByUserId,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
};
