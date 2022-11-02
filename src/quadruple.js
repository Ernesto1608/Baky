const {Stack, Queue} = require('datastructures-js');
const { TYPE } = require('./semantic-constants.js');
const Semantics = require('./semantics.js');

class Quadruple {
    constructor() {
        this.semantics = new Semantics();
        this.quadruples = [];
        this.operands = new Stack();
        this.types = new Stack();
        this.operators = new Stack();
        this.currentTemporal = 1;
        this.jumps = new Stack();
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

    processIf(line) {
        const [rightO] = [this.operands.pop()];
        const [rightT] = [this.types.pop()];
        if(rightT != TYPE.BOOLEAN) throw new Error(`Conditions must have type boolean on line ${line}`);    
        this.quadruples.push(["gotoF", rightO, null, null]);
        this.jumps.push(this.quadruples.length-1);
    }

    processElse() {
        this.quadruples.push(["goto", null, null, null]);
        this.returnIf();
        this.jumps.push(this.quadruples.length-1);
    }

    returnIf() {
        const jump = this.jumps.pop();
        this.quadruples[jump][3] = this.quadruples.length;
    }

    storeWhile() {
        this.jumps.push(this.quadruples.length);
    }

    returnWhile() {
        const jumpDone = this.jumps.pop();
        const jumpWhile = this.jumps.pop();
        this.quadruples.push(["goto", null, null, jumpWhile]);
        this.quadruples[jumpDone][3] = this.quadruples.length;
    }
}

module.exports = Quadruple;