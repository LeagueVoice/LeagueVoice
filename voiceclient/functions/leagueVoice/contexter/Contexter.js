const DepGraph = require('dependency-graph').DepGraph;

/**
 * Contexter: context injection.
 * Like dependency injection but done per-request.
 * With new inputs every time.
 *
 * See *.text.js for eample usage.
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
    asFunction: ({ deps, func }) => {
      this.graph.setNodeData(name, { type: 'function', func });
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
Contexter.prototype.execute = function(target, inputs = {}) {
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
        context[name] = Contexter.selectPromises(subDeps, context)
          .then(dep.func);
        break;
    }
  }
  return context[target];
};

Contexter.prototype.hasTarget = function(target) {
  return this.graph.hasNode(target);
};

/**
 * Select promises from an map into a new, resolved map.
 *
 * let names = [ 'foo', 'bar' ];
 * let promiseMap = {
 *   foo: Promise.resolve(100),
 *   bar: Promise.resolve(200),
 *   baz: Promise.resolve(300)
 * };
 * selectPromises(names, promiseMap).then(result => {
 *   // result is { foo: 100, bar: 200 }
 * })
 */
Contexter.selectPromises = function(names, promiseMap) {
  return Promise.all(names.map(name => promiseMap[name]))
    .then(values => {
      let result = {};
      values.forEach((value, i) => result[names[i]] = value);
      return result;
    });
};

module.exports = Contexter;
