const chai = require('chai');
const expect = chai.expect;

const Contexter = require('./Contexter');
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
      func({ rootVal, suffix }) {
        return rootVal + ' ' + suffix;
      },
      params: {
        suffix: 'world'
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
      func({ rootVal, suffix }) {
        return rootVal + ' ' + suffix;
      },
      params: {
        suffix: 'world'
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

  it('test params', function(done) {
    let context = new Contexter();
    context.register('params').asFunction({
      deps: [],
      func({ vals }) {
        return vals.pop();
      },
      params: {
        vals: [ 5, 4, 3, 2, 1 ]
      }
    });
    context.execute('params').then(v => expect(v).to.equal(1))
      .then(() => context.execute('params')).then(v => expect(v).to.equal(2))
      .then(() => context.execute('params')).then(v => expect(v).to.equal(3))
      .then(() => done(), done);
  });

  it('test cached', function(done) {
    let context = new Contexter();
    context.register('cached').asFunction({
      cached: true,
      deps: [],
      func({ vals }) {
        return vals.pop();
      },
      params: {
        vals: [ 5, 4, 3, 2, 1 ]
      }
    });
    context.execute('cached').then(v => expect(v).to.equal(1))
      .then(() => context.execute('cached')).then(v => expect(v).to.equal(1))
      .then(() => done(), done);
  });

  it('test cleanup', function(done) {
    let context = new Contexter();
    // fake stack
    context.register('val').asFunction({
      deps: [],
      func({ vals }) {
        return vals.pop();
      },
      cleanup({ val, vals }) {
        vals.push(val);
      },
      params: {
        vals: [ 5, 4, 3, 2, 1 ]
      }
    });
    context.register('result').asFunction({
      deps: [ 'val' ],
      func({ val }) {
        return delay(50).then(() => val);
      }
    });
    let a = context.execute('result').then(v => expect(v).to.equal(1));
    let b = context.execute('result').then(v => expect(v).to.equal(2));
    Promise.all([ a, b ])
      .then(() => delay(10))
      .then(() => context.execute('result'))
      .then(v => expect(v).to.be.lessThan(3))
      .then(() => done(), done);
  });
});
