const httpStatus = require('http-status');
const { Participant, Presentation, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a participant
 * @param {Object} participantBody
 * @return {Promise<Slide>}
 */
const createParticipant = async (participantBody) => {
  const participant = await Participant.create(participantBody);
  await Presentation.findByIdAndUpdate(participantBody.presentation, {
    $push: {
      participants: participant._id,
    },
  });
  if (participantBody.user) {
    await User.findByIdAndUpdate(participantBody.user, {
      $push: {
        participants: participant._id,
      },
    });
  }
  return participant;
};

/**
 *
 * @param {string} presentationId
 * @returns {Promise<QueryResult>}
 */
const getParticipantsByPresentationId = async (presentationId) => {
  const participants = await Participant.find({}).populate({
    path: 'presentation',
    match: {
      presentation: presentationId,
    },
  });
  return participants;
};

/**
 * Get Participant by id
 * @param {ObjectId} id
 * @return {Promise<Participant>}
 */
const getParticipantById = async (id) => {
  const participant = await Participant.findById(id).populate({
    path: 'answers',
  });
  return participant;
};

/**
 * Delete participant by id
 * @param {String} id
 * @returns {Promise<Participant>}
 */
const deleteParticipantById = async (id) => {
  const participant = await getParticipantById(id);
  if (!participant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Participant not found');
  }
  await Presentation.findByIdAndUpdate(participant.presentation, {
    $pull: {
      participants: id,
    },
  });
  if (participant.user) {
    await User.findByIdAndUpdate(participant.user, {
      $pull: {
        participants: id,
      },
    });
  }
  await participant.remove();
  return participant;
};

module.exports = {
  createParticipant,
  getParticipantsByPresentationId,
  getParticipantById,
  deleteParticipantById,
};
