const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const logger = require('../lib/logger');

fs.readdirSync(path.join(__dirname, 'models')).forEach((file) => {
  require(`./models/${file}`);
});

module.exports = (MONGO_URI) => {
  mongoose.connect(
    MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (error) => {
      if (error) logger.error(error.message);
      else logger.info('Base de données prête');
    },
  );
};
