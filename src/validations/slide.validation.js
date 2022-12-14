const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSlide = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    question: Joi.string().trim(),
    image: Joi.string().uri(),
    category: Joi.string().valid('yesNo', 'multipleChoice', 'answer'),
  }),
};

const getSlidesByPresentationId = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSlideById = {
  params: Joi.object().keys({
    slideId: Joi.string().custom(objectId),
  }),
};

const updateSlideById = {
  params: Joi.object().keys({
    slideId: Joi.string().custom(objectId),
    presentationId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    question: Joi.string().trim(),
    image: Joi.string().uri(),
    category: Joi.string().valid('yesNo', 'multipleChoice', 'answer'),
  }),
};

const deleteSlideById = {
  params: Joi.object().keys({
    slideId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSlide,
  getSlidesByPresentationId,
  getSlideById,
  updateSlideById,
  deleteSlideById,
};
