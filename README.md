# HTTP Middleware Logger

> Express middleware, adds a child logger to each request.


## Getting Started

```shell
npm install --save @cork-labs/http-middleware-logger
```

```javascript
const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: name });

// your application setup
const httpLogger = require('@cork-labs/http-middleware-logger');
const options = {};
app.use(httpLogger(options, logger));

// your route
app.get('/path', (req, res, next) => {
  req.logger.info(data, 'message');
})
```

Provide an instance of [bunyan](https://www.npmjs.com/package/bunyan) logger when configuring the middleware.

Note: [@cork-labs/logger](https://www.npmjs.com/package/@cork-labs/logger) can help with configuring Bunyan.

## API

The child logger is exposed in `req.logger`.

The essential [bunyan](https://www.npmjs.com/package/bunyan) API:

- `req.logger.child(fields, true)` // true preserves parent's stream configuration
- `req.logger.warn(data, 'message')`
- `req.logger.error(data, 'message')`
- `req.logger.debug(data, 'message')`
- `req.logger.child(data, 'message')`

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

### message (default: 'http request')

### requestKey (default: 'request')

### requestFields (default: { method: 'method', path: 'path' })

### traceKey (default: 'trace')

### traceFields (default: { uuid: 'uuid', current: 'path' })


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


## Tools

- [npm-bump](https://www.npmjs.com/package/npm-bump)
- [chai](http://chaijs.com/api/)
- [sinon](http://sinonjs.org/)
- [sinon-chai](https://github.com/domenic/sinon-chai)


## [MIT License](LICENSE)

[Copyright (c) 2018 Cork Labs](http://cork-labs.mit-license.org/2018)
