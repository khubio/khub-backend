const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { slideService } = require('../services');

const createSlide = catchAsync(async (req, res) => {
  const slide = await slideService.createSlide({ ...req.body });
  res.status(httpStatus.CREATED).send(slide);
});

const getSlidesByPresentationId = catchAsync(async (req, res) => {
  const slides = await slideService.getSlidesByPresentationId(req.query.presentationId);
  res.send(slides);
});

const getSlideById = catchAsync(async (req, res) => {
  const slide = await slideService.getSlideById(req.params.presentationId);
  res.send(slide);
});

const updateSlideById = catchAsync(async (req, res) => {
  const slide = await slideService.updateSlideById(req.params.slideId, req.body);
  res.send(slide);
});

const deleteSlideById = catchAsync(async (req, res) => {
  const slide = await slideService.deleteSlideById(req.params.slideId);
  res.send(slide);
});

module.exports = {
  createSlide,
  getSlidesByPresentationId,
  getSlideById,
  updateSlideById,
  deleteSlideById,
};
