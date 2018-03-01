'use strict';

const defaults = {
  message: 'http request',
  requestKey: 'request',
  requestFields: {
    method: 'method',
    path: 'path'
  },
  traceKey: 'trace',
  traceFields: {
    uuid: 'uuid',
    current: 'current'
  }
};

const logger = function (config, logger) {
  config = Object.assign({}, defaults, config);

  // -- middleware

  return function (req, res, next) {
    const fields = {};
    fields[config.traceKey] = {};
    for (let key in config.traceFields) {
      fields[config.traceKey][config.traceFields[key]] = req.trace[key];
    }
    // true preserves parent's stream configuration
    req.logger = logger.child(fields, true);
    const data = {};
    data[config.requestKey] = {};
    for (let key in config.requestFields) {
      data[config.requestKey][config.requestFields[key]] = req[key];
    }
    req.logger.info(data, config.message);
    next();
  };
};

module.exports = logger;
