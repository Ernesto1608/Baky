const {Stack, Queue} = require('datastructures-js');
const Semantics = require('./semantics.js');

class Quadruple {
    constructor() {
        this.semantics = new Semantics();
        this.quadruples = new Queue();
        this.operands = new Stack();
        this.types = new Stack();
        this.operators = new Stack();
    }
}

module.exports = Quadruple;