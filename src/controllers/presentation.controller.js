const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { presentationService } = require('../services');

const createPresentation = catchAsync(async (req, res) => {
  const creator = req.user.id;
  const presentation = await presentationService.createPresentation({ ...req.body, creator });
  res.status(httpStatus.CREATED).send(presentation);
});

const getPresentationsByCreator = catchAsync(async (req, res) => {
  const creator = req.user.id;
  const presentations = await presentationService.getPresentationsByCreator(creator);
  res.send(presentations);
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
  getPresentationsByCreator,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
};
