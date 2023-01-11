const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const questionSchema = mongoose.Schema(
  {
    message: {
      type: String,
      require: true,
      trim: true,
    },
    presentation: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Presentation',
    },
    username: {
      type: String,
      require: true,
      trim: true,
    },
    answerBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    voteNumber: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
questionSchema.plugin(toJSON);
questionSchema.plugin(paginate);

/**
 * @typedef Question
 */

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
