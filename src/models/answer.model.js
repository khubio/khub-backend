const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// require('mongoose-type-url');

const answerSchema = mongoose.Schema(
  {
    slide: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Slide',
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    answerCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
answerSchema.plugin(toJSON);
answerSchema.plugin(paginate);

answerSchema.pre('remove', async function (next) {
  await Promise.all([
    this.model('Slide').update({ _id: { $eq: this.slide } }, { $pull: { answers: this._id } }, { multi: false }),
  ]);
  next();
});

answerSchema.pre('save', async function (next) {
  await Promise.all([
    this.model('Slide').update({ _id: { $eq: this.slide } }, { $addToSet: { answers: this._id } }, { multi: false }),
  ]);
  next();
});

/**
 * @typedef Answer
 */

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
