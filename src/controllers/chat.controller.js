const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { chatService } = require('../services');

const getChats = catchAsync(async (req, res) => {
  const { presentationId } = req.params;
  const chats = await chatService.getChats(presentationId);
  res.send(chats);
});

const createChat = catchAsync(async (req, res) => {
  const { username, message, userId } = req.body;
  const { presentationId } = req.params;
  const chat = await chatService.createChat(presentationId, message, username, userId || null);
  res.status(httpStatus.CREATED).send(chat);
});

module.exports = {
  getChats,
  createChat,
};
