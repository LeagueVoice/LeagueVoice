const DepGraph = require('dependency-graph').DepGraph;

/**
 * Contexter: context injection.
 * Like dependency injection but done per-request.
 * With new inputs every time.
 *
 * See *.text.js for example usage.
 */
function Contexter() {
  this.graph = new DepGraph();
}

/**
 * Register a input, constant, or function.
 *
 * Inputs are passed in at each invocation.
 * Constants are fixed across every invocation.
 * Functions are executed each invocation (if they are required) and form a dependency graph.
 *
 * Any input or constant can be a promise, and functions may return proimises.
 */
Contexter.prototype.register = function(name) {
  if (this.graph.hasNode(name) && this.graph.getNodeData(name))
    throw new Error(`Name "${name}" already registered with value ${this.graph.getNodeData(name)}`);
  this.graph.addNode(name, null);
  return {
    asInput: () => this.graph.setNodeData(name, { type: 'input' }),
    asConstant: value => this.graph.setNodeData(name, { type: 'constant', value }),
    asFunction: ({ deps, func, params={}, cached=false, cleanup }) => {
      let nodeData = { type: 'function', func, cleanup, params, cached };
      this.graph.setNodeData(name, nodeData);
      for (dep of deps) {
        this.graph.addNode(dep, null); // Allow out-of-order registration.
        this.graph.addDependency(name, dep);
      }
    }
  };
};

/**
 * Execute a particular function and return a promise of the value.
 *
 * Can also get inputs or constants (also as a promise).
 */
Contexter.prototype.execute = function(target, inputs={}) {
  let order = this.graph.dependenciesOf(target).concat(target);
  let context = {};
  for (let name of order) {
    let dep = this.graph.getNodeData(name);
    if (!dep)
      throw new Error(`Missing unregistered dependency: "${name}"`);
    switch(dep.type) {
      case 'input':
        if (!inputs.hasOwnProperty(name))
          throw Error(`Missing input ${name}.`);
        context[name] = inputs[name];
        break;
      case 'constant':
        context[name] = dep.value;
        break;
      case 'function':
        let subDeps = this.graph.outgoingEdges[name];
        context[name] = Contexter.selectPromises(subDeps, context, dep.params)
          .then(dep.func);
        if (dep.cached) // If cached function, convert to constant.
          this.graph.setNodeData(name, { type: 'constant', value: context[name] });
        break;
    }
  }
  // CLEANUP
  Promise.props(context)
    .then(contextVals => {
      order.reverse();
      return Promise.all(order.map(name => {
        let dep = this.graph.getNodeData(name);
        if (dep.type !== 'function' || !dep.cleanup)
          return null;
        return Promise.props(dep.params)
          .then(params => {
            Object.assign(params, contextVals);
            dep.cleanup(params);
          })
          .catch(e => {
            console.error(`Context ${name} threw error during cleanup.`);
            console.error(e);
          });
      }))
    })
    .then(() => Object.keys(context).forEach(k => delete context[k])); // memory leak paranoia
  // RESULT
  return context[target];
};

Contexter.prototype.hasTarget = function(target) {
  return this.graph.hasNode(target);
};

/**
 * Select promises from an map into a new, resolved map.
 *
 * let names = [ 'foo', 'bar' ]; // Names to include from promiseMap
 * let promiseMap = {
 *   foo: Promise.resolve(100),
 *   bar: Promise.resolve(200),
 *   baz: Promise.resolve(300)
 * };
 * let params = { // Additional values to include (all).
 *   pop: Promise.resolve(400)
 * };
 * selectPromises(names, promiseMap, params).then(result => {
 *   // result is { foo: 100, bar: 200, pop: 400 }
 * })
 */
Contexter.selectPromises = function(names, promiseMap, params) {
  return Promise
    .all([
      Promise.all(names.map(name => promiseMap[name])),
      Promise.props(params)
    ])
    .then(([ values, params ]) => {
      values.forEach((value, i) => params[names[i]] = value);
      return params;
    });
};

module.exports = Contexter;
