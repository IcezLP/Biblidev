const express = require('express');
const next = require('next');
const logger = require('./lib/logger');
const database = require('./database');
const routes = require('./routes');

const server = express();
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const URL_MAP = {
      '/connexion': '/auth/login',
    };

    // Parse application/json
    server.use(express.json());
    // Parse application/x-www-form-urlencoded
    server.use(express.urlencoded({ extended: true }));

    database(process.env.MONGO_URI);
    routes(server);

    server.get('*', (req, res) => {
      const url = URL_MAP[req.path];

      if (url) {
        return app.render(req, res, url);
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
