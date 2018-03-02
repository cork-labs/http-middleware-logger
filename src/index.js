'use strict';

const onHeaders = require('on-headers');

const defaults = {
  requestMessage: 'http-middleware-logger::request',
  requestKey: 'request',
  requestFields: {
    method: 'method',
    path: 'path'
  },
  responseMessage: 'http-middleware-logger::response',
  responseKey: 'response',
  responseFields: {
    statusCode: 'status'
  },
  responseTiming: false,
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
    const requestData = {};
    requestData[config.requestKey] = {};
    for (let key in config.requestFields) {
      requestData[config.requestKey][config.requestFields[key]] = req[key];
    }
    req.logger.info(requestData, config.requestMessage);

    onHeaders(res, () => {
      const responseData = {};
      responseData[config.responseKey] = {};
      for (let key in config.responseFields) {
        responseData[config.responseKey][config.responseFields[key]] = res[key];
      }
      req.logger.info(responseData, config.responseMessage);
    });
    next();
  };
};

module.exports = logger;
