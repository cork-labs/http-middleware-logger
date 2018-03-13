'use strict';

const Timing = require('@cork-labs/class-timing');

const defaults = {
  fields: {},
  requestMessage: 'monkfish.port.http.request',
  requestKey: 'request',
  requestFields: {
    method: 'method',
    path: 'path'
  },
  responseMessage: 'monkfish.port.http.response',
  responseKey: 'response',
  responseTimingKey: 'timing',
  responseFields: {
    statusCode: 'status',
    errorCode: 'code'
  },
  traceKey: 'trace',
  traceFields: {
    uuid: 'uuid',
    current: 'current'
  },
  severityMap: {}
};

const logger = function (config, logger) {
  config = Object.assign({}, defaults, config);

  const mapSeverity = (res) => {
    return config.severityMap[res.statusCode];
  };

  // -- middleware

  return function (req, res, next) {
    const fields = Object.assign({}, config.fields);
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
    req.timing = new Timing('start');

    res.log = () => {
      const responseData = {};
      responseData[config.responseKey] = {};
      for (let key in config.responseFields) {
        responseData[config.responseKey][config.responseFields[key]] = res[key];
      }
      if (config.responseTimingKey) {
        responseData[config.responseTimingKey] = req.timing.elapsed();
      }
      const severity = res.severity || mapSeverity(res) || 'error';
      req.logger[severity](responseData, config.responseMessage);
    };
    next();
  };
};

module.exports = logger;
