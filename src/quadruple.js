const {Stack, Queue} = require('datastructures-js');
const Semantics = require('./semantics.js');

class Quadruple {
    constructor() {
        this.semantics = new Semantics();
        this.quadruples = [];
        this.operands = new Stack();
        this.types = new Stack();
        this.operators = new Stack();
        this.currentTemporal = 1;
    }

    processOperator(operator, line) {
        const [rightO, leftO] = [this.operands.pop(), this.operands.pop()];
        const [rightT, leftT] = [this.types.pop(), this.types.pop()];
        const type = this.semantics.semantiConstants.CUBE.validOperation(rightT, leftT, operator, line);
        this.quadruples.push([operator, leftO, rightO, 't'+ this.currentTemporal]);
        this.operands.push('t'+this.currentTemporal);
        this.types.push(type);
        this.currentTemporal++;
        this.operators.pop();
    }

    processAssign(operator, line) {
        const [rightO, leftO] = [this.operands.pop(), this.operands.pop()];
        const [rightT, leftT] = [this.types.pop(), this.types.pop()];
        if(rightT != leftT) throw new Error(`Invalid operation ${leftT} ${operator} ${rightT} on line ${line}`);        ;
        this.quadruples.push([operator, leftO, rightO, null]);
        this.operators.pop();
    }

    processWrite() {
        const [rightO] = [this.operands.pop()];
        const [rightT] = [this.types.pop()];
        this.quadruples.push(["write", rightO, null, null]);
    }

    processRead() {
        const [rightO] = [this.operands.pop()];
        const [rightT] = [this.types.pop()];
        this.quadruples.push(["read", rightO, null, null]);
    }
}

module.exports = Quadruple;