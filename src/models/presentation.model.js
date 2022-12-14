const mongoose = require('mongoose');
require('mongoose-type-url');
const { toJSON, paginate } = require('./plugins');
const { presentationLayout } = require('../config/enum');

const presentationSchema = mongoose.Schema(
  {
    creator: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'User',
        },
      ],
      require: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: presentationLayout,
      default: presentationLayout.default,
    },
    layout: {
      type: mongoose.SchemaTypes.Url,
    },
    slides: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Slide',
        },
      ],
    },
    participants: {
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
presentationSchema.plugin(toJSON);
presentationSchema.plugin(paginate);

presentationSchema.pre('remove', async function (next) {
  await Promise.all([
    this.model('Slide').update({ _id: { $in: this.slides } }, { $pull: { presentation: this._id } }, { multi: true }),
    this.model('Participant').update(
      { _id: { $in: this.participants } },
      { $pull: { presentation: this._id } },
      { multi: true }
    ),
  ]);
  next();
});

/**
 * @typedef Presentation
 */

const Presentation = mongoose.model('Presentation', presentationSchema);
module.exports = Presentation;
