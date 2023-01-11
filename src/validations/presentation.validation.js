const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPresentation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getPresentations = {
  query: Joi.object().keys({
    roles: Joi.string(),
  }),
};

const getPresentationById = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
};

const updatePresentationById = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    accessModifier: Joi.string(),
    group: Joi.string().custom(objectId),
  }),
};

const deletePresentationById = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPresentation,
  getPresentations,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
};
