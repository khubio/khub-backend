const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { presentationService, slideService } = require('../services');

const createPresentation = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;
  const presentation = await presentationService.createPresentation({ ...req.body, creator: userId });
  const sampleSlide = {
    id: '',
    type: 'paragraph',
    question: 'Welcome to KHUB',
    description: 'Try your best experience with us',
    answers: [],
  };
  await slideService.createSlide({ presentation: presentation._id, ...sampleSlide });
  res.status(httpStatus.CREATED).send(presentation);
});

const getPresentations = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;
  const { roles } = req.query;
  const rolesSplit = roles.split(',');
  let presentationsOwner = [];
  let presentationsCollaborator = [];
  if (rolesSplit.includes('creator')) {
    presentationsOwner = await presentationService.getPresentationsByCreator(userId);
  }
  if (rolesSplit.includes('collaborator')) {
    presentationsCollaborator = await presentationService.getPresentationsByCollaborator(userId);
  }

  res.send([presentationsOwner, presentationsCollaborator]);
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

const addCollaborator = catchAsync(async (req, res) => {
  const { presentationId } = req.params;
  const { email } = req.body;
  const presentation = await presentationService.addCollaborator(presentationId, email);
  res.send(presentation);
});

const removeCollaborator = catchAsync(async (req, res) => {
  const { presentationId } = req.params;
  const { email } = req.body;
  await presentationService.removeCollaborator(presentationId, email);
  res.send();
});

module.exports = {
  createPresentation,
  getPresentations,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
  addCollaborator,
  removeCollaborator,
};
