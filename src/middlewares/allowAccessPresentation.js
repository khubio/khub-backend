const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { presentationService } = require('../services');

const allowAccessPresentation = () => async (req, res, next) => {
  const { _id: userId } = req.user;
  const { presentationId } = req.params;
  const presentation = await presentationService.getPresentationById(presentationId);
  const isCreator = String(presentation.creator) === String(userId);
  const isCollaborator = !!presentation.collaborators.find((collaborator) => String(collaborator._id) === String(userId));
  if (!isCreator && !isCollaborator) {
    next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
  } else {
    next();
  }
};

module.exports = allowAccessPresentation;
