module.exports = (server) => {
  if (typeof process.send === 'function') {
    server.on('listening', () => {
      let address = server.address();
      process.send({
        event: 'listening',
        port: address.port
      });
    });
  }
};
