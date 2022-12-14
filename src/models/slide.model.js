const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { questionCategory } = require('../config/enum');

const slideSchema = mongoose.Schema(
  {
    presentation: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Presentation',
        },
      ],
      require: true,
    },
    question: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    answers: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Answer',
      },
    ],
    category: {
      type: String,
      enum: questionCategory,
      default: questionCategory.multipleChoice,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
slideSchema.plugin(toJSON);
slideSchema.plugin(paginate);

slideSchema.pre('remove', async function (next) {
  await Promise.all([
    this.model('Presentation').update({ _id: { $eq: this.presentation } }, { $pull: { slides: this._id } }, { multi: true }),
    this.model('Answer').remove({ _id: { $in: this.answers } }, { multi: true }),
  ]);
  next();
});

/**
 * @typedef Slide
 */

const Slide = mongoose.model('Slide', slideSchema);
module.exports = Slide;
