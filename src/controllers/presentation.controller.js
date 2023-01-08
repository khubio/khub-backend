const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { presentationService, slideService } = require('../services');

const createPresentation = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;
  const presentation = await presentationService.createPresentation({ ...req.body, creator: userId });
  await slideService.createSlide({ presentation: presentation._id });
  res.status(httpStatus.CREATED).send(presentation);
});

const getPresentations = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;
  const { roles } = req.query;
  const [presentationsOwner, presentationsCollaborator] = await Promise.all([
    presentationService.getPresentationsByCreator(userId),
    presentationService.getPresentationsByCollaborator(userId),
  ]);

  if (roles.split(',').length === 2) {
    res.send([...presentationsOwner, ...presentationsCollaborator]);
  } else if (roles.split(',').includes('creator')) {
    res.send(presentationsOwner);
  } else {
    res.send(presentationsCollaborator);
  }
});

const getPresentationById = catchAsync(async (req, res) => {
  const presentation = await presentationService.getPresentationById(req.params.presentationId);
  res.send(presentation);
});

const updatePresentationById = catchAsync(async (req, res) => {
  const presentation = await presentationService.updatePresentationById(req.params.presentationId, req.body);
  res.send(presentation);
});

const deletePresentationById = catchAsync(async (req, res) => {
  const presentation = await presentationService.deletePresentationById(req.params.presentationId);
  res.send(presentation);
});

module.exports = {
  createPresentation,
  getPresentations,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
};
