const mongoose = require('mongoose');
const logger = require('../lib/logger');

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
