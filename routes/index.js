const authRoutes = require('./auth');
const usersRoutes = require('./users');
const categoriesRoutes = require('./categories');
const resourcesRoutes = require('./resources');
const pluginRoutes = require('./plugin');
const adminResourcesRoutes = require('./admin/resources');
const adminUsersRoutes = require('./admin/users');
const adminCategoriesRoutes = require('./admin/categories');
const adminAnalyticsRoutes = require('./admin/analytics');
const adminDashboardRoutes = require('./admin/dashboard');
const withAdmin = require('./middlewares/withAdmin');

module.exports = (server) => {
  server.use('/api/auth', authRoutes);
  server.use('/api/users', usersRoutes);
  server.use('/api/categories', categoriesRoutes);
  server.use('/api/resources', resourcesRoutes);

  server.use('/api/plugin/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  server.use('/api/plugin', pluginRoutes);

  // Middleware de vérification d'admin
  server.use('/api/admin/*', withAdmin);
  // Routes admin
  server.use('/api/admin/users', adminUsersRoutes);
  server.use('/api/admin/resources', adminResourcesRoutes);
  server.use('/api/admin/categories', adminCategoriesRoutes);
  server.use('/api/admin/analytics', adminAnalyticsRoutes);
  server.use('/api/admin/dashboard', adminDashboardRoutes);
};
