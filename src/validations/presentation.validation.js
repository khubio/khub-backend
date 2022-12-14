const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPresentation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required().valid('default', 'import'),
    layout: Joi.string().uri(),
  }),
};

const getPresentationsByCreator = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
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
    layout: Joi.string().uri(),
    type: Joi.string().valid('default', 'import'),
  }),
};

const deletePresentationById = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPresentation,
  getPresentationsByCreator,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
};
