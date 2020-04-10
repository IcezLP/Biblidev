const authRoutes = require('./auth');
const usersRoutes = require('./users');
const categoriesRoutes = require('./categories');
const resourcesRoutes = require('./resources');

module.exports = (server) => {
  server.use('/api/auth', authRoutes);
  server.use('/api/users', usersRoutes);
  server.use('/api/categories', categoriesRoutes);
  server.use('/api/resources', resourcesRoutes);
};
