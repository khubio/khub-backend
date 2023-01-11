/* eslint-disable no-restricted-syntax */
const { users, messageBoxes, questionBoxes, presentations, participants } = require('../models');
const logger = require('../../config/logger');
const { chatService, questionService } = require('../../services');
// const { questionService } = require('../../services');

const indexOfBySocketId = (list, socketId) => {
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].socketId === socketId) {
      return i;
    }
  }
  return -1;
};
const handlers = (io, socket) => {
  socket.on('userJoin', (userId) => {
    users.push({
      socketId: socket.id,
      userId,
    });
    logger.info(`User${userId} joined`);
  });

  socket.on('addMessgeBox', (presentationId) => {
    messageBoxes.push({
      socketId: socket.id,
      presentationId,
    });
    logger.info(`Message Box of ${presentationId} joined`);
  });

  socket.on('addQuestionBox', (presentationId) => {
    messageBoxes.push({
      questionBoxes: socket.id,
      presentationId,
    });
    logger.info(`Question Box of ${presentationId} joined`);
  });

  socket.on('sendMessage', (presentationId, message) => {
    for (const messageBox of messageBoxes) {
      if (messageBox.presentationId === presentationId) {
        io.to(messageBox.socketId).emit('receiveMessageBox', message);
      }
    }
  });

  socket.on('sendQuestion', (presentationId, question) => {
    for (const questionBox of questionBoxes) {
      if (questionBox.presentationId === presentationId) {
        io.to(questionBox.socketId).emit('receiveQuestionBox', question);
      }
    }
  });

  socket.on('updateQuestion', (presentationId, question) => {
    for (const questionBox of questionBoxes) {
      if (questionBox.presentationId === presentationId) {
        io.to(questionBox.socketId).emit('pollQuestion', question);
      }
    }
  });

  socket.on('notifyUser', (userId, message) => {
    for (const user of users) {
      if (user.userId === userId) {
        io.to(user.socketId).emit('Notify', message);
      }
    }
  });

  socket.on('addParticipant', (presentationId) => {
    participants.push({ presentationId, socketId: socket.id });
  });

  socket.on('addPresentation', (presentationId, currentSlide) => {
    presentations.push({ presentationId, currentSlide, socketId: socket.id });
  });

  socket.on('changeSlide', (presentationId, newSlide) => {
    for (const presentation of presentations) {
      if (presentation.presentationId === presentationId) {
        presentation.currentSlide = newSlide;
      }
    }
    for (const participant of participants) {
      if (participant.presentationId === presentationId) {
        io.to(participant.socketId).emit('changedSlide', newSlide);
      }
    }
  });

  socket.on('reload', (presentationId) => {
    for (const participant of participants) {
      if (participant.presentationId === presentationId) {
        io.to(participant.socketId).emit('Reloaded', presentationId);
      }
    }
  });

  socket.on('answerQuestion', (answerIndex) => {
    const participant = participants.filter((p) => p.socketId === socket.id)[0];
    for (const presentation of presentations) {
      if (participant.presentationId && participant.presentationId === presentation.presentationId) {
        io.to(presentation.socketId).emit('answeredQuestion', answerIndex);
      }
    }
  });

  socket.on('message', async ({ presentationId, message }) => {
    if (message.presentationId === presentationId) {
      io.emit('messageResponse', message);
      const { text, author } = message;
      await chatService.createChat(presentationId, text, author.username, author.id);
    }
  });

  socket.on('sendCurrentSlide', (data) => {
    io.emit('receiveCurrentSlide', data);
  });

  // socket.on('sendQuestion', (data) => {
  //   io.emit('receiveQuestion', data);
  // });

  socket.on('sendQuestion', async ({ presentationId, question }) => {
    if (question.presentationId === presentationId) {
      const { username, text, userId } = question;
      const newQuestion = await questionService.createQuestion(presentationId, text, username, userId);
      io.emit('receiveQuestion', newQuestion);
    }
  });

  socket.on('updateVoteQuestion', async (question) => {
    const { id, ...questionBody } = question;
    await questionService.updateQuestion(question.id, questionBody);
  });

  socket.on('disconnection', () => {
    if (indexOfBySocketId(presentations, socket.id)) {
      presentations.pop(indexOfBySocketId(presentations, socket.id));
    }
    if (indexOfBySocketId(participants, socket.id)) {
      participants.pop(indexOfBySocketId(participants, socket.id));
    }
    if (indexOfBySocketId(users, socket.id)) {
      users.pop(indexOfBySocketId(users, socket.id));
    }
  });
};

module.exports = handlers;
