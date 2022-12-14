const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createParticipant = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim(),
    user: Joi.string().custom(objectId),
  }),
};

const getParticipantsByPresentationId = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getParticipantById = {
  params: Joi.object().keys({
    participantId: Joi.string().custom(objectId),
  }),
};

const deleteParticipantById = {
  params: Joi.object().keys({
    participantId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createParticipant,
  getParticipantsByPresentationId,
  getParticipantById,
  deleteParticipantById,
};
