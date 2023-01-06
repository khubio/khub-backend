const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const chatSchema = mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
chatSchema.plugin(toJSON);
chatSchema.plugin(paginate);

/**
 * @typedef Chat
 */

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
