const authRoutes = require('./auth');
const usersRoutes = require('./users');

module.exports = (server) => {
  server.use('/api/auth', authRoutes);
  server.use('/api/users', usersRoutes);
};
