const httpStatus = require('http-status');
const { Presentation, User, Group } = require('../models');
const { deleteSlideById } = require('./slide.service');
const { getUserByEmail } = require('./user.service');
const ApiError = require('../utils/ApiError');

/**
 * Create a presentation
 * @param {Object} presentationBody
 * @return {Promise<Presentation>}
 */
const createPresentation = async (presentationBody) => {
  const presentation = await Presentation.create(presentationBody);
  await User.findByIdAndUpdate(presentationBody.creator, {
    $push: {
      presentations: presentation._id,
    },
  });
  return presentation;
};

/**
 *
 * @param {string} creatorId
 * @returns {Promise<QueryResult>}
 */
const getPresentationsByCreator = async (userId) => {
  const presentations = await Presentation.find({
    creator: userId,
  });
  return presentations;
};

const getPresentationsByCollaborator = async (userId) => {
  const collaborator = await User.findById({
    _id: userId,
  }).populate({
    path: 'collaboratePresentations',
    populate: {
      path: 'creator',
      select: 'firstName lastName',
    },
  });
  return collaborator.collaboratePresentations;
};
/**
 * Get presentation by id
 * @param {ObjectId} id
 * @return {Promise<Presentation>}
 */
const getPresentationById = async (id) => {
  const presentation = await Presentation.findById(id)
    .populate({
      path: 'slides',
      populate: 'answers',
    })
    .populate({
      path: 'collaborators',
      select: 'email',
    });
  return presentation;
};

/**
 * update presentation by id
 * @param {String} id
 * @param {Object} updateBody
 * @returns {Promise<Presentation>}
 */

const updatePresentationById = async (id, updateBody) => {
  const presentation = await getPresentationById(id);
  if (!presentation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Presentation not found');
  }

  Object.assign(presentation, updateBody);
  await presentation.save();
  return presentation;
};

/**
 * Delete presentation by id
 * @param {String} id
 * @returns {Promise<Presentation>}
 */
const deletePresentationById = async (id) => {
  const presentation = await getPresentationById(id);
  if (!presentation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Presentation not found');
  }
  await Promise.all(presentation.slides.map((slide) => deleteSlideById(slide._id)));
  await presentation.remove();
  return presentation;
};

const addCollaborator = async (id, email) => {
  const presentation = await getPresentationById(id);
  if (!presentation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Presentation not found');
  }
  const user = await getUserByEmail(email);
  if (String(presentation.creator) === String(user._id)) {
    throw new ApiError(httpStatus.CONFLICT, "This is owner's email");
  }
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const updatedPresentation = await Presentation.findByIdAndUpdate(presentation._id, {
    $push: {
      collaborators: user._id,
    },
  });
  await User.findByIdAndUpdate(user._id, {
    $push: {
      collaboratePresentations: presentation._id,
    },
  });
  return updatedPresentation;
};

const removeCollaborator = async (presentationId, email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
    $pull: {
      collaborators: user._id,
    },
  });
  await User.findByIdAndUpdate(user._id, {
    $pull: {
      collaboratePresentations: presentationId,
    },
  });
  return updatedPresentation;
};

const updateAccessModifier = async (presentationId, accessModifier, group) => {
  if (group) {
    const presentation = await Presentation.findByIdAndUpdate(presentationId, {
      accessModifier,
      group,
    });
    await Group.findByIdAndUpdate(group, {
      $push: {
        presentations: presentationId,
      },
    });
    return presentation;
  }
  const presentation = await Presentation.findByIdAndUpdate(presentationId, {
    accessModifier,
    group: null,
  });

  if (presentation.group) {
    await Group.findByIdAndUpdate(presentation.group, {
      $pull: {
        presentation: presentationId,
      },
    });
  }
  return presentation;
};

module.exports = {
  createPresentation,
  getPresentationsByCreator,
  getPresentationsByCollaborator,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
  addCollaborator,
  removeCollaborator,
  updateAccessModifier,
};
