'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const httpLogger = require('../src/index');

describe('httpLogger ()', function () {
  it('should be a function', function () {
    expect(httpLogger).to.be.a('function');
  });

  describe('when invoked', function () {
    beforeEach(function () {
      this.middleware = httpLogger();
    });

    it('should return a middleware function', function () {
      expect(this.middleware).to.be.a('function');
      expect(this.middleware.length).to.equal(3);
    });
  });

  describe('middleware api', function () {
    beforeEach(function () {
      this.childLogger = {
        info: sinon.spy(),
        error: sinon.spy()
      };
      this.logger = {
        child: sinon.stub()
      };
      this.logger.child.returns(this.childLogger);
      this.middleware = httpLogger({}, this.logger);
    });

    describe('when the middleware function is invoked', function () {
      beforeEach(function () {
        this.req = {
          method: 'PUT',
          path: '/foo/bar',
          trace: {
            uuid: '1f2',
            current: '3d1'
          }
        };
        this.res = {};
        this.nextSpy = sinon.spy();
        this.middleware(this.req, this.res, this.nextSpy);
      });

      it('should invoke the next() argument', function () {
        expect(this.nextSpy).to.have.callCount(1);
      });

      it('should create a child logger', function () {
        const expectedTrace = {
          trace: {
            current: '3d1',
            uuid: '1f2'
          }
        };
        expect(this.logger.child).to.have.been.calledWithExactly(expectedTrace);
        expect(this.req.logger).to.equal(this.childLogger);
      });

      it('should create a timing object', function () {
        expect(this.req.timing).to.be.an('object');
        expect(this.req.timing.constructor.name).to.equal('Timing');
      });

      it('should log the request"', function () {
        const expectedLog = {
          request: {
            method: 'PUT',
            path: '/foo/bar'
          }
        };
        expect(this.childLogger.info).to.have.been.calledWithExactly('monkfish.port.http.request', expectedLog);
      });

      it('should expose log() in the res object"', function () {
        expect(this.res.log).to.be.a('function');
      });

      describe('when res.log() is invoked', function () {
        beforeEach(function () {
          this.res.statusCode = 333;
          this.res.errorCode = 999;
          this.res.log({ foo: 'bar' });
        });

        it('should log the response"', function () {
          const expectedLog = {
            response: {
              status: 333,
              code: 999
            },
            timing: {
              total: 0
            }
          };
          expect(this.childLogger.error).to.have.been.calledWithExactly('monkfish.port.http.response', expectedLog);
        });
      });
    });
  });

  describe('middleware configuration', function () {
    beforeEach(function () {
      this.childLogger = {
        info: sinon.spy(),
        error: sinon.spy()
      };
      this.logger = {
        child: sinon.stub()
      };
      this.logger.child.returns(this.childLogger);
    });

    describe('when configuration is custom', function () {
      beforeEach(function () {
        this.config = {
          requestMessage: 'foobar.request',
          requestKey: 'foo',
          requestFields: {
            method: 'bar'
          },
          responseMessage: 'foobar.response',
          repsonseKey: 'baz',
          repsonseFields: {
            statusCode: 'qux'
          },
          responseTiming: true,
          traceKey: 'quux',
          traceFields: {
            uuid: 'quuux'
          }
        };
        this.middleware = httpLogger(this.config, this.logger);
      });

      describe('and the middleware function is invoked', function () {
        beforeEach(function () {
          this.req = {
            method: 'PUT',
            path: '/foo/bar',
            trace: {
              uuid: '1f2',
              current: '3d1'
            }
          };
          this.res = {};
          this.nextSpy = sinon.spy();
          this.middleware(this.req, this.res, this.nextSpy);
        });

        it('should pass the custom data to the child logger', function () {
          const expectedTrace = {
            quux: {
              quuux: '1f2'
            }
          };
          expect(this.logger.child).to.have.been.calledWithExactly(expectedTrace);
        });

        it('should log custom fields"', function () {
          const expectedLog = {
            foo: {
              bar: 'PUT'
            }
          };
          expect(this.childLogger.info).to.have.been.calledWithExactly('foobar.request', expectedLog);
        });
      });
    });
  });
});
