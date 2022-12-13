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

/**
 * @typedef Participant
 */

const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;
