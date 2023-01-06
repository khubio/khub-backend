const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { accessModifier } = require('../config/enum');

const presentationSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      require: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slides: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Slide',
        },
      ],
    },
    currentSlide: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Slide',
    },
    collaborators: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'UserGroup',
        },
      ],
      default: [],
    },
    accessModifier: {
      type: String,
      enum: accessModifier,
      default: accessModifier.public,
    },
    group: {
      type: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Group',
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
presentationSchema.plugin(toJSON);
presentationSchema.plugin(paginate);

/**
 * @typedef Presentation
 */

const Presentation = mongoose.model('Presentation', presentationSchema);
module.exports = Presentation;
