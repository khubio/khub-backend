const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAnswer = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
    slideId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.bool(),
    text: Joi.string().trim(),
    code: Joi.string().valid('A', 'B', 'C', 'D', 'answer'),
  }),
};

const getAnswersBySlideId = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
    slideId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAnswerById = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
    slideId: Joi.string().custom(objectId),
    answerId: Joi.string().custom(objectId),
  }),
};

const updateAnswerById = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
    answerId: Joi.string().custom(objectId),
    slideId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.bool(),
    text: Joi.string().trim(),
    code: Joi.string().valid('A', 'B', 'C', 'D', 'answer'),
  }),
};

const deleteAnswerById = {
  params: Joi.object().keys({
    answerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAnswer,
  getAnswersBySlideId,
  getAnswerById,
  updateAnswerById,
  deleteAnswerById,
};
