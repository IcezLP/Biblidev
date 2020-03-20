const express = require('express');
const next = require('next');

const server = express();
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    // Parse application/json
    server.use(express.json());
    // Parse application/x-www-form-urlencoded
    server.use(express.urlencoded({ extended: true }));

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(process.env.SERVER_PORT, (error) => {
      if (error) throw error;
      else console.log(`Server ready on port http://localhost:${process.env.SERVER_PORT}`);
    });
  })
  .catch((error) => {
    throw error;
  });
