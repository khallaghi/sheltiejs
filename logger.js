'use strict';
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
  return `${info.timestamp} | ${info.level}: ${info.message}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'error',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()]
});

module.exports = logger;
