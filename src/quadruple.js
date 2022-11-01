const {Stack, Queue} = require('datastructures-js');

class Quadruple {
    constructor() {
        this.quadruples = new Queue();
        this.operands = new Stack();
        this.types = new Stack();
        this.operators = new Stack();
    }
}

module.exports = Quadruple;