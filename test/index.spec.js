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
      this.middleware = httpTrace();
    });

    describe('when the middleware function is invoked', function () {
      beforeEach(function () {
        this.req = {
          headers: {
            'x-cork-labs-req-parent-id': 'foo',
            'x-cork-labs-client-ip': 'bar'
          }
        };
        this.res = {};
        this.nextSpy = sinon.spy();
        this.middleware(this.req, this.res, this.nextSpy);
      });

      it('should invoke the next() argument', function () {
        expect(this.nextSpy).to.have.callCount(1);
      });

      it('should expose the "trace" object in req', function () {
        expect(this.req.trace).to.be.an('object');
      });

      it('should generate a "uuid"', function () {
        expect(this.req.trace.uuid).to.match(/^[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}$/);
      });

      it('should generate a "current"', function () {
        expect(this.req.trace.current).to.match(/^[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}$/);
      });

      it('should carry over the "parent"', function () {
        expect(this.req.trace.parent).to.equal('foo');
      });

      it('should carry over the "ip"', function () {
        expect(this.req.trace.ip).to.equal('bar');
      });
    });

    describe('when "req.headers" contains an id', function () {
      beforeEach(function () {
        this.req = {
          headers: {
            'x-cork-labs-req-trace-id': 'foobar'
          }
        };
        this.res = {};
        this.nextSpy = sinon.spy();
      });

      describe('and the middleware function is invoked', function () {
        beforeEach(function () {
          this.middleware(this.req, this.res, this.nextSpy);
        });

        it('should expose the "trace" object in req', function () {
          expect(this.req.trace.uuid).to.equal('foobar');
        });
      });
    });
  });

  describe('middleware configuration', function () {
    beforeEach(function () {
      this.req = {};
      this.res = {
        status: sinon.spy(),
        header: sinon.spy(),
        json: sinon.spy()
      };
      this.nextSpy = sinon.spy();
    });

    describe('when the configuration contains custom headers', function () {
      beforeEach(function () {
        this.config = {
          headers: {
            uuid: 'x-foo',
            parent: 'x-bar',
            ip: 'x-baz'
          }
        };
        this.middleware = httpTrace(this.config);
      });

      describe('and "req.headers" is populated accordingly', function () {
        beforeEach(function () {
          this.req = {
            headers: {
              'x-foo': '11',
              'x-bar': '22',
              'x-baz': '33'
            }
          };
          this.res = {};
          this.nextSpy = sinon.spy();
        });

        describe('and the middleware function is invoked', function () {
          beforeEach(function () {
            this.middleware(this.req, this.res, this.nextSpy);
          });

          it('should read from the custom headers', function () {
            expect(this.req.trace.uuid).to.equal('11');
            expect(this.req.trace.parent).to.equal('22');
            expect(this.req.trace.ip).to.equal('33');
          });
        });
      });
    });
  });
});
