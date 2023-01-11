const { Chat } = require('../models');

const getChats = async (presentationId) => {
  const chats = await Chat.find({ presentation: presentationId }).sort({ createdAt: -1 });
  return chats;
};

const createChat = async (presentationId, message, username, userId = null) => {
  const chat = await Chat.create({
    presentation: presentationId,
    message,
    username,
    user: userId,
  });
  return chat;
};
exports.module = {
  getChats,
  createChat,
};
