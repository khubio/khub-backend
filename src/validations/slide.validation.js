/* eslint-disable prettier/prettier */
const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { slideType } = require('../config/enum');

const createSlides = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    slides: Joi.array().items(Joi.object({
      slideType: Joi.string().valid(...Object.values(slideType)),
      question: Joi.string().trim(),
      answers: Joi.array().items(Joi.object().keys({
        text: Joi.string().trim(),
        status: Joi.bool(),
      })).default([]),
      description: Joi.string().trim(),
      image: Joi.string().uri(),
      category: Joi.string().valid('heading', 'multipleChoice', 'paragraph'),
    })),
  }),
};

const updateSlides = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    slides: Joi.array().items(Joi.object({
      id: Joi.string().custom(objectId),
      slideType: Joi.string().valid(...Object.values(slideType)),
      question: Joi.string().trim(),
      answers: Joi.array().items(Joi.object().keys({
        text: Joi.string().trim(),
        status: Joi.bool(),
      })).default([]),
      description: Joi.string().trim(),
      image: Joi.string().uri(),
      category: Joi.string().valid('heading', 'multipleChoice', 'paragraph'),
    })),
  }),

};

const deleteSlides = {
  params: Joi.object().keys({
    presentationId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    slides: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

module.exports = {
  createSlides,
  updateSlides,
  deleteSlides,
};
