const { createLogger, format, transports, addColors } = require('winston');
const moment = require('moment');
const path = require('path');

const { timestamp, label, printf, combine, colorize } = format;

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${moment(timestamp).format('DD/MM/YYYY HH:mm:ss')} [${level}]: ${message}`;
});

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
  },
};

addColors(customLevels.colors);

const logger = createLogger({
  format: combine(label(), timestamp(), customFormat),
  levels: customLevels.levels,
  transports: [
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, '../logs/server.log') }),
    new transports.Console({ format: combine(colorize(), label(), timestamp(), customFormat) }),
  ],
});

module.exports = logger;
