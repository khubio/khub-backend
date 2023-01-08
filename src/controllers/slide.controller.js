const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { slideService } = require('../services');

const createSlides = catchAsync(async (req, res) => {
  const presentation = req.params.presentationId;
  const { slides } = req.body;
  const newSlides = await Promise.all(slides.map(({ id, ...slide }) => slideService.createSlide({ slide, presentation })));
  res.status(httpStatus.CREATED).send(newSlides);
});

const updateSlides = catchAsync(async (req, res) => {
  const { slides } = req.body;
  const newSlides = await Promise.all(
    slides.map(({ answers, isUpdated, ...slide }) => slideService.updateSlideById(slide.id, { ...slide }))
  );
  res.send(newSlides);
});

const deleteSlides = catchAsync(async (req, res) => {
  const { slides } = req.body;
  const deletedSlide = Promise.all(slides.map((slide) => slideService.deleteSlideById(slide)));
  res.send(deletedSlide);
});

module.exports = {
  createSlides,
  updateSlides,
  deleteSlides,
};
