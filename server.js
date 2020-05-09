require('dotenv').config();
const express = require('express');
const next = require('next');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('./lib/logger');
const database = require('./database');
const routes = require('./routes');

const server = express();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    // Urls à redirigées
    const URL_MAP = {
      // Routes publiques
      '/connexion': '/auth/login',
      '/inscription': '/auth/register',
      '/mot-de-passe-oublie': '/auth/forgot',
      '/verification': '/auth/verify',
      '/proposition': '/submit',
      '/nouveau-mot-de-passe': '/auth/reset',
      // Routes utilisateurs
      '/tableau-de-bord': '/user/dashboard',
      '/parametres': '/user/settings',
      // Routes admin
      '/admin/utilisateurs': '/admin/users',
      '/admin/ressources': '/admin/resources',
      '/admin/ressources/ajout': '/admin/resources/add',
      '/admin/ressources/importation': '/admin/resources/import',
      '/admin/ressources/validation': '/admin/resources/awaiting',
      '/admin/google/analytics': '/admin/google/g-analytics',
      '/admin/google/search-console': '/admin/google/g-search-console',
    };

    if (!dev) {
      server.set('trust proxy', true);
    }

    server.use(helmet());
    server.use(compression());
    // Parse application/json
    server.use(express.json());
    // Parse application/x-www-form-urlencoded
    server.use(express.urlencoded({ extended: false }));

    database(process.env.MONGO_URI);
    routes(server);

    // Affichage des pages
    server.get('*', (req, res) => {
      const url = URL_MAP[req.path];

      if (url) {
        return app.render(req, res, url, req.query);
      }

      return handle(req, res);
    });

    server.listen(process.env.SERVER_PORT, (error) => {
      if (error) throw error;
      else logger.info(`Serveur prêt sur http://localhost:${process.env.SERVER_PORT}`);
    });
  })
  .catch((error) => {
    throw error;
  });
