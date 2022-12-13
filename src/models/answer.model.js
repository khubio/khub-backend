const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { answerCode } = require('../config/enum');

const answerSchema = mongoose.Schema(
  {
    slide: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Slide',
        },
      ],
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
    },
    text: {
      type: String,
      require: true,
      trim: true,
    },
    code: {
      type: String,
      enum: answerCode,
      require: true,
    },
    participant: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Participant',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
answerSchema.plugin(toJSON);
answerSchema.plugin(paginate);

/**
 * @typedef Answer
 */

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
