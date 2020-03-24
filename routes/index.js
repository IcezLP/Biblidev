const authRoutes = require('./auth');

module.exports = (server) => {
  server.use('/api/auth', authRoutes);
};
