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

const getGroups = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getGroupById = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
  }),
};

const getGroupsByUserId = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const getGroupOwner = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
  }),
};

const queryMembers = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
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

const deleteUserGroup = {
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
  getGroups,
  getGroupsByUserId,
  getGroupOwner,
  queryMembers,
  updateUserGroupById,
  deleteUserGroup,
  deleteGroup,
  updateGroup,
  getGroupById,
};
