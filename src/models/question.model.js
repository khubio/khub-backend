const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const questionSchema = mongoose.Schema(
  {
    message: {
      type: String,
      require: true,
      trim: true,
    },
    participant: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Participant',
    },
    answerBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    votes: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Participant',
        },
      ],
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
