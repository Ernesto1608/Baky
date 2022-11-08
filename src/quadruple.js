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
        if(rightT != this.semantics.semantiConstants.TYPE.BOOLEAN) throw new Error(`Conditions must have type boolean on line ${line}`);    
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

    processFor(line) {
        const forEnd = this.operands.pop();
        const forEndT = this.types.pop();
        const forStart = this.operands.pop();
        const forStartT = this.types.pop();
        if (forStartT != "INT" && forStartT != "DOUBLE" || forEndT != "INT" && forEndT != "DOUBLE") throw new Error(`For must have int or double on line ${line}`);
        this.jumps.push(this.quadruples.length);
        this.quadruples.push(["<", forStart, forEnd, 't'+(this.currentTemporal)]);
        this.jumps.push(this.quadruples.length);
        this.quadruples.push(["gotoF", 't'+(this.currentTemporal), null, null]);
        this.quadruples.push(["+", forStart, 1, forStart]);
        this.currentTemporal++;
    }

    endFor() {
        const jumpForDone = this.jumps.pop();
        const jumpFor = this.jumps.pop();
        this.quadruples.push(["goto", null, null, jumpFor]);
        this.quadruples[jumpForDone][3] = this.quadruples.length;
    }

    createFunctionJump() {
        const funcStart = this.semantics.functionsTable[this.semantics.currentFunctionCall].start;
        this.quadruples.push(["goto", null, null, funcStart]);
        this.quadruples.push(["=", 't'+this.currentTemporal, `_${this.semantics.currentFunctionCall}`, null]);
        this.currentTemporal++;
    }

    createReturnFromFunction(id) {
        const jump = this.quadruples.length + this.semantics.functionsTable[id].paramsTable.length + 2;
        this.quadruples.push(["=", `_${id}Return`, jump, null]);
        //change scope
    }

    createParam(line) {
        const operand = this.operands.pop();
        const type = this.types.pop();
        const param = this.semantics.functionsTable[this.semantics.currentFunctionCall].paramsTable[this.semantics.paramsCounter];
        if(param.type != type) {
            throw new Error(`Wrong parameter type on line ${line}`);
        }
        this.quadruples.push(["=", param.id, operand, null]);
        this.semantics.paramsCounter++;
    }

    returnFromFunction(scope) {
        this.quadruples.push(["goto", null, null, `_${scope}Return`]);
    }

    handleReturn(line) {
        const operand = this.operands.pop();
        const type = this.types.pop();
        const scope = this.semantics.scopeStack.peek();
        if(this.semantics.functionsTable[scope].type != type) {
            throw new Error(`Wrong return type on line ${line}`);
        }
        this.quadruples.push(["=", `_${scope}`, operand, null]);
        this.returnFromFunction(scope);
    }

}

module.exports = Quadruple;