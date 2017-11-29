const chai = require('chai');
const expect = chai.expect;

const Contexter = require('./index');
const delay = delay => new Promise(resolve => setTimeout(resolve, delay));

describe('Contexter', function() {
  it('test basic', function(done) {
    let context = new Contexter();
    context.register('final').asFunction({ // Test out of order.
      deps: [ 'left', 'right' ],
      func({ left, right }) {
        return [ left, right ];
      }
    });
    context.register('rootVal').asConstant('hello');
    context.register('left').asFunction({
      deps: [ 'rootVal' ],
      func({ rootVal }) {
        return rootVal + ' world';
      }
    });
    context.register('right').asFunction({
      deps: [ 'rootVal' ],
      func({ rootVal }) {
        return rootVal + ' darkness my old friend';
      }
    });
    context.execute('final')
      .then(vals => {
        expect(vals[0]).to.equal('hello world');
        expect(vals[1]).to.equal('hello darkness my old friend');
      })
      .then(done, done);
  });

  it('test async', function(done) {
    let context = new Contexter();
    context.register('final').asFunction({ // Test out of order.
      deps: [ 'left', 'right' ],
      func({ left, right }) {
        return [ left, right ];
      }
    });
    context.register('rootVal').asConstant(delay(10).then(() => 'hello'));
    context.register('left').asFunction({
      deps: [ 'rootVal' ],
      func({ rootVal }) {
        return rootVal + ' world';
      }
    });
    context.register('right').asFunction({
      deps: [ 'rootVal' ],
      func({ rootVal }) {
        return delay(30).then(() => rootVal + ' darkness my old friend');
      }
    });
    context.execute('final')
      .then(vals => {
        expect(vals[0]).to.equal('hello world');
        expect(vals[1]).to.equal('hello darkness my old friend');
      })
      .then(done, done);
  });
});
