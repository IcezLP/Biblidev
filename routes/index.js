const jwt = require('jsonwebtoken');
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const categoriesRoutes = require('./categories');
const resourcesRoutes = require('./resources');
const adminResourcesRoutes = require('./admin/resources');
const adminUsersRoutes = require('./admin/users');
const adminCategoriesRoutes = require('./admin/categories');
const User = require('../database/models/User');

module.exports = (server) => {
  server.use('/api/auth', authRoutes);
  server.use('/api/users', usersRoutes);
  server.use('/api/categories', categoriesRoutes);
  server.use('/api/resources', resourcesRoutes);

  // Protège les routes admin en vérifiant qu'un utilisateur admin fait la requête
  server.use('/api/admin/*', async (req, res, next) => {
    // Extrai l'en-tête d'autorisation
    const authHeader = req.headers.authorization;

    // Si l'en-tête d'autorisation n'est pas vide
    if (authHeader) {
      // Décompose le token et récupère uniquement la partie requise à la vérification
      const token = authHeader.split(' ')[1];

      // Vérifie le token et le décrypte
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
        // Si il y a une erreur
        if (err) {
          return res.sendStatus(403);
        }

        // Cherche l'utilisateur
        const user = await User.findById(decoded._id);

        // Vérifie que l'utilisateur existe et qu'il est admin
        if (!user || (user && !user.isAdmin)) {
          return res.sendStatus(403);
        }

        return next();
      });
    } else {
      res.sendStatus(401);
    }
  });

  server.use('/api/admin/users', adminUsersRoutes);
  server.use('/api/admin/resources', adminResourcesRoutes);
  server.use('/api/admin/categories', adminCategoriesRoutes);
};
