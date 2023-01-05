const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createGroup = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    members: Joi.array().items(
      Joi.object().keys({
        userId: Joi.string().custom(objectId),
        role: Joi.string().required().valid('owner', 'coOwner', 'member'),
      })
    ),
  }),
};

const createUserGroup = {
  body: Joi.object().keys({
    group: Joi.string().custom(objectId),
    user: Joi.string().custom(objectId),
  }),
};

const updateGroup = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    members: Joi.array().items(
      Joi.object().keys({
        userId: Joi.string().custom(objectId),
        role: Joi.string().required().valid('owner', 'coOwner', 'member'),
      })
    ),
  }),
};

const getGroupDetailsById = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
  }),
};

const getGroupsByUserId = {
  query: Joi.object().keys({
    roles: Joi.string(),
  }),
};

const updateUserGroupById = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    role: Joi.string().valid('owner', 'coOwner', 'member', 'blacklist'),
  }),
};

const deleteUserGroupById = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteGroup = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createGroup,
  createUserGroup,
  getGroupsByUserId,
  updateUserGroupById,
  deleteUserGroupById,
  deleteGroup,
  updateGroup,
  getGroupDetailsById,
};
