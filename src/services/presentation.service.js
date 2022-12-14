const httpStatus = require('http-status');
const { participantService } = require('.');
const { Presentation, User, Slide } = require('../models');
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
const getPresentationsByCreator = async (creatorId) => {
  const presentations = await Presentation.find({}).populate({
    path: 'creator',
    match: {
      user: creatorId,
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
 * @param {String} id
 * @returns {Promise<Presentation>}
 */
const deletePresentationById = async (id) => {
  const presentation = await getPresentationById(id);
  if (!presentation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Presentation not found');
  }

  const participants = await participantService.getParticipantsByPresentationId(presentation._id);
  if (participants.length) {
    await Promise.all(participants.map((participant) => participantService.deleteParticipantById(participant._id)));
  }
  await Promise.all([
    User.findByIdAndUpdate(presentation.creator, {
      $pull: {
        presentations: presentation._id,
      },
    }),
    Slide.deleteMany({
      presentation: presentation._id,
    }),
  ]);

  await presentation.remove();
  return presentation;
};

module.exports = {
  createPresentation,
  getPresentationsByCreator,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
};
