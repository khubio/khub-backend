const handlers = require('./handlers');

const initSockets = (io) => {
  io.on('connection', async (socket) => {
    handlers(io, socket);
  });
};

module.exports = initSockets;
