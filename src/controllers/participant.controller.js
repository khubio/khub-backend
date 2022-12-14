const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { participantService } = require('../services');

const createParticipant = catchAsync(async (req, res) => {
  const presentation = req.params.presentationId;
  const participant = await participantService.createParticipant({ ...req.body, presentation });
  res.status(httpStatus.CREATED).send(participant);
});

const getParticipantsByPresentationId = catchAsync(async (req, res) => {
  const participants = await participantService.getParticipantsByPresentationId(req.params.presentationId);
  res.send(participants);
});

const getParticipantById = catchAsync(async (req, res) => {
  const participant = await participantService.getParticipantById(req.params.participantId);
  res.send(participant);
});

const deleteParticipantById = catchAsync(async (req, res) => {
  const participant = await participantService.deleteParticipantById(req.params.participantId);
  res.send(participant);
});

module.exports = {
  createParticipant,
  getParticipantsByPresentationId,
  getParticipantById,
  deleteParticipantById,
};
