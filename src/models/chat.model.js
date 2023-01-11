const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const chatSchema = mongoose.Schema(
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
      trim: true,
      require: true,
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
chatSchema.plugin(toJSON);
chatSchema.plugin(paginate);

/**
 * @typedef Chat
 */

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
