# HTTP Middleware Logger

> Express middleware, adds a child logger to each request.


## Getting Started

```shell
npm install --save @cork-labs/http-middleware-logger
```

```javascript
// your application setup
const httpLogger = require('@cork-labs/http-middleware-logger');
app.use(httpLogger());

// your route
app.get('/path', (req, res, next) => {
  req.info(data, 'message');
})
```


## API

### req.info(data, message)

### req.warn(data, message)

### req.error(data, message)

### req.debug(data, message)


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

### tracetKey (default: 'tracet')

### tracetFields (default: { uuid: 'uuid', current: 'path' })


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
