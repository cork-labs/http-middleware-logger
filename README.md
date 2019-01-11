# HTTP Middleware Logger

> Express middleware, adds a child logger to each request.


## Getting Started

```shell
npm install --save @cork-labs/http-middleware-logger
```

```javascript
const bunyan = require('bunyan');
const Logger = require('@cork-labs/monkfish-adapter-logger').Logger;

// your application setup
const logger = Logger.createLogger({ name: 'my-app', streams: [{ type:'console' }] });
const httpLogger = require('@cork-labs/http-middleware-logger');
const options = {};
this._express.use(httpLogger(config, logger));
// use a middleware such as onHeaders to log responses
this._express.use((req, res, next) => {
  onHeaders(res, () => res.log());
  next();
});

// your route
app.get('/path', (req, res, next) => {
  req.logger.info(data, 'message');
})
```

Provide an instance of [@cork-labs/monkfish-adapter-logger](https://www.npmjs.com/package/@cork-labs/monkfish-adapter-logger).

It supports:
- child loggers (child contexts)
- multiple streams at once (e.g.: console, [bunyan](https://www.npmjs.com/package/@cork-), files, ...)

## API

A child logger is created per request, and trace information is added to the logger.

The request is immediately logged.

```
> my-app | Thu, 10 Jan 2019 23:51:35 GMT | INFO | HttpApi::request()
  trace: {
    "uuid": "5b42547e-bd2f-4090-896c-18edfd79f39b",
    "current": "5efc8d65-2dd3-458c-8a46-96aa37985a4f"
  }
  --
  request: {
    "method": "GET",
    "path": "/account/5a9578f91e0d4724ed57ffe3"
  }
```

The child logger is exposed in `req.logger` and you can log further messages.

All messages contain the same trace object plus whatever data you provide to them.

```
16:29:19.279Z  INFO az.auth: Service::handle()
  trace: {
    "uuid": "5b42547e-bd2f-4090-896c-18edfd79f39b",
    "current": "5efc8d65-2dd3-458c-8a46-96aa37985a4f"
  }
  --
  event: {
    "type": "account.get",
    "params": {
      "id": "5a9578f91e0d4724ed57ffe3"
    }
  }
```

The essential [monkfish-adapter-logger](https://www.npmjs.com/package/@cork-labs/monkfish-adapter-logger) API:

- `req.logger.child(data = {})` returns a new logger, containing all the parent context plus the provided optional data
- `req.logger.set(key, value = undefined)` - adds key to context data (avoid adding objects, keep it flat!)
- `req.logger.debug('message', data = {})` - logs debug level message, with adittional data (optional)
- `req.logger.info('message', data = {})` - same, info level
- `req.logger.warn('message', data = {})` - same, warning level
- `req.logger.error('message', data = {}, err = ...)` - same, error level, plus optional error (ideally a subclass of Error)
- `req.logger.flat(prefix = '', obj)` flattens the object for logging

### res.log()

When the response is sent, invoke `res.log()`.

You can use a middleware such as [onHeaders]() to be notified when the response is sent.

```javascript
this._express.use(httpLogger(config, logger));
// use a middleware such as onHeaders to log responses
this._express.use((req, res, next) => {
  onHeaders(res, () => res.log());
  next();
});
```

The response log contains a number of configurable.

The severity of this message can be configured via `options.severityMap`.

```
> my-app | Thu, 10 Jan 2019 23:51:35 GMT | INFO | HttpApi::response()
  trace: {
    "uuid": "5b42547e-bd2f-4090-896c-18edfd79f39b",
    "current": "5efc8d65-2dd3-458c-8a46-96aa37985a4f"
  }
  --
  response: {
    "status": 200
  }
  --
  timing: {
    "total": 20,
    "routed": 5,
    "handled": 15
  }
```

## Configuration

The middleware can be configured via an options object when calling its factory function.

```javascript
const options = {
  headers: {
    message: 'http.request.received'
  }
};
app.use(httpLogger(options));
```

### requestMessage (default: 'http request')

### requestKey (default: 'request')

### requestFields (default: { method: 'method', path: 'path' })

### responsetMessage (default: 'http response')

### responseKey (default: 'response')

### responseTimingKey (default: 'timing')

### responseFields (default: { status: 'statusCode' })

### traceKey (default: 'trace')

### traceFields (default: { uuid: 'uuid', current: 'path' })

### severityMap (default: {  })


## Develop

```shell
# lint and fix
npm run lint

# run test suite
npm test

# lint and test
npm run build

# serve test coverage
npm run coverage

# publish a minor version
node_modules/.bin/npm-bump minor
```

### Contributing

We'd love for you to contribute to our source code and to make it even better than it is today!

Check [CONTRIBUTING](https://github.com/cork-labs/contributing/blob/master/CONTRIBUTING.md) before submitting issues and PRs.


## Links

- [npm-bump](https://www.npmjs.com/package/npm-bump)
- [chai](http://chaijs.com/api/)
- [sinon](http://sinonjs.org/)
- [sinon-chai](https://github.com/domenic/sinon-chai)


## [MIT License](LICENSE)

[Copyright (c) 2018 Cork Labs](http://cork-labs.mit-license.org/2018)
