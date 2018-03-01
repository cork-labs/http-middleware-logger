'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const httpTrace = require('../src/index');

describe('httpTrace ()', function () {
  it('should be a function', function () {
    expect(httpTrace).to.be.a('function');
  });

  describe('when invoked', function () {
    beforeEach(function () {
      this.middleware = httpTrace();
    });

    it('should return a middleware function', function () {
      expect(this.middleware).to.be.a('function');
      expect(this.middleware.length).to.equal(3);
    });
  });

  describe('middleware api', function () {
    beforeEach(function () {
      this.childLogger = {
        info: sinon.spy()
      };
      this.logger = {
        child: sinon.stub()
      };
      this.logger.child.returns(this.childLogger);
      this.middleware = httpTrace({}, this.logger);
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
        expect(this.logger.child).to.have.been.calledWithExactly(expectedTrace, true);
      });

      it('should log the request"', function () {
        const expectedLog = {
          request: {
            method: 'PUT',
            path: '/foo/bar'
          }
        };
        expect(this.childLogger.info).to.have.been.calledWithExactly(expectedLog, 'http request');
      });
    });
  });

  describe('middleware configuration', function () {
    beforeEach(function () {
      this.childLogger = {
        info: sinon.spy()
      };
      this.logger = {
        child: sinon.stub()
      };
      this.logger.child.returns(this.childLogger);
    });

    describe('when ', function () {
      beforeEach(function () {
        this.config = {
          message: 'foobar.foobar',
          requestKey: 'foo',
          requestFields: {
            method: 'bar'
          },
          traceKey: 'baz',
          traceFields: {
            uuid: 'qux'
          }
        };
        this.middleware = httpTrace(this.config, this.logger);
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
            baz: {
              qux: '1f2'
            }
          };
          expect(this.logger.child).to.have.been.calledWithExactly(expectedTrace, true);
        });

        it('should log custom fields"', function () {
          const expectedLog = {
            foo: {
              bar: 'PUT'
            }
          };
          expect(this.childLogger.info).to.have.been.calledWithExactly(expectedLog, 'foobar.foobar');
        });
      });
    });
  });
});
