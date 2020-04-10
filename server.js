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
    // Urls à bloquées
    const URL_STOP = ['/routes/*', '/logs/*'];

    // Urls à redirigées
    const URL_MAP = {
      '/connexion': '/auth/login',
      '/inscription': '/auth/register',
      '/mot-de-passe-oublie': '/auth/forgot',
      '/verification': '/auth/verify',
      '/proposition': '/submit',
    };

    server.use(helmet());
    server.use(compression());
    // Parse application/json
    server.use(express.json());
    // Parse application/x-www-form-urlencoded
    server.use(express.urlencoded({ extended: true }));

    if (!dev) {
      // Ajout de req.hostname et req.ip
      server.set('trust proxy', 1);
    }

    database(process.env.MONGO_URI);
    routes(server);

    server.all(URL_STOP, (req, res) => {
      return app.render(req, res, '/_error');
    });

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
