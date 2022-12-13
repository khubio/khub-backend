const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    users: [
      {
        type: [
          {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'UserGroup',
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
groupSchema.plugin(toJSON);
groupSchema.plugin(paginate);

/**
 * @typedef Group
 */

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
