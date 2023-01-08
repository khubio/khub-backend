const httpStatus = require('http-status');
const { Presentation, User, UserGroup } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a presentation
 * @param {Object} presentationBody
 * @return {Promise<Presentation>}
 */
const createPresentation = async (presentationBody) => {
  const presentation = await Presentation.create(presentationBody);
  await User.findByIdAndUpdate(presentationBody.creator, {
    $push: {
      presentations: presentation._id,
    },
  });
  return presentation;
};

/**
 *
 * @param {string} creatorId
 * @returns {Promise<QueryResult>}
 */
const getPresentationsByCreator = async (userId) => {
  const presentations = await Presentation.find({
    creator: userId,
  }).populate({
    path: 'creator',
    select: 'firstName lastName',
  });
  return presentations;
};

const getPresentationsByCollaborator = async (userId) => {
  const presentations = await UserGroup.find({
    user: userId,
  }).populate({
    path: 'presentationsCollaborated',
    match: {
      user: userId,
    },
  });
  return presentations.filter((presentation) => presentation.presentationsCollaborated.length > 0);
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
 * @param {String} id
 * @returns {Promise<Presentation>}
 */
const deletePresentationById = async (id) => {
  const presentation = await getPresentationById(id);
  if (!presentation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Presentation not found');
  }
  await presentation.remove();
  return presentation;
};

module.exports = {
  createPresentation,
  getPresentationsByCreator,
  getPresentationsByCollaborator,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
};
