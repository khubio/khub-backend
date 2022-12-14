const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const participantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    user: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'User',
        },
      ],
    },
    presentation: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Presentation',
        },
      ],
    },
    answer: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Answer',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
participantSchema.plugin(toJSON);
participantSchema.plugin(paginate);

participantSchema.pre('remove', async function (next) {
  await Promise.all([
    this.model('Answer').update({ _id: { $in: this.answers } }, { $pull: { participants: this._id } }, { multi: true }),
    this.model('User').update({ _id: { $in: this.users } }, { $pull: { participants: this._id } }, { multi: true }),
    this.model('Presentation').update(
      { _id: { $in: this.presentations } },
      { $pull: { participants: this._id } },
      { multi: true }
    ),
  ]);
  next();
});

/**
 * @typedef Participant
 */

const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;
