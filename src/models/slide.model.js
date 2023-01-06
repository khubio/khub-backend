const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { slideType, chartType } = require('../config/enum');
require('mongoose-type-url');

const slideSchema = mongoose.Schema(
  {
    presentation: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Presentation',
      require: true,
    },
    question: {
      type: String,
      trim: true,
      max: 200,
    },
    image: {
      type: mongoose.SchemaTypes.Url,
    },
    answers: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Answer',
        },
      ],
    },
    type: {
      type: String,
      enum: slideType,
      default: slideType.multipleChoice,
    },
    chart: {
      type: String,
      enum: chartType,
      default: chartType.bars,
    },
    heading: {
      type: String,
      trim: true,
      max: 200,
    },
    subHeading: {
      type: String,
      trim: true,
      max: 200,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
slideSchema.plugin(toJSON);
slideSchema.plugin(paginate);

/**
 * @typedef Slide
 */

const Slide = mongoose.model('Slide', slideSchema);
module.exports = Slide;
