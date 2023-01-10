const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { slideType, chartType } = require('../config/enum');

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
      type: String,
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
    description: {
      type: String,
      trim: true,
      max: 200,
    },
  },
  {
    timestamps: true,
  }
);

slideSchema.pre('remove', async function (next) {
  await Promise.all([
    this.model('Answer').updateMany({ _id: { $in: this.answers } }, { $pull: { slide: this._id } }, { multi: true }),
    this.model('Presentation').updateOne(
      { _id: { $eq: this.presentation } },
      { $pull: { slides: this._id } },
      { multi: false }
    ),
  ]);
  next();
});

// add plugin that converts mongoose to json
slideSchema.plugin(toJSON);
slideSchema.plugin(paginate);

/**
 * @typedef Slide
 */

const Slide = mongoose.model('Slide', slideSchema);
module.exports = Slide;
