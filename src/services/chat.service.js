const { Chat } = require('../models');

const getChats = async (presentationId) => {
  const chats = await Chat.find({ presentation: presentationId }).sort({ createdAt: 1 });
  return chats;
};

const createChat = async (presentationId, text, username, userId = null) => {
  const chat = await Chat.create({
    presentation: presentationId,
    text,
    username,
    user: userId,
  });
  return chat;
};

module.exports = {
  getChats,
  createChat,
};
