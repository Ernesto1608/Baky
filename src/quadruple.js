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
        this.currentParameters = [];
    }

    processOperator(operator, line) {
        const [rightO, leftO] = [this.operands.pop(), this.operands.pop()];
        const [rightT, leftT] = [this.types.pop(), this.types.pop()];
        const type = this.semantics.semantiConstants.CUBE.validOperation(rightT, leftT, operator, line);
        const address = this.semantics.memory.assignMemory("local", type, true);
        const typeMem = this.semantics.memory.getTypeFromAddress(address);
        this.semantics.functionsTable[this.semantics.scopeStack.peek()].resources[typeMem]++;
        this.quadruples.push([operator, leftO, rightO, address]);
        this.operands.push(address);
        this.types.push(type);
        this.operators.pop();
    }

    processConstant(value, type) {
        let address, push = true;
        if(this.semantics.constsTable[value] != undefined){
            push = false;
            address = this.semantics.constsTable[value];
        } else {
            address = this.semantics.memory.assignMemory("cons", type, false);
            this.semantics.constsTable[value] = address;
        }
        const scopeMem = this.semantics.memory.getScopeFromAddress(address);
        const typeMem = this.semantics.memory.getTypeFromAddress(address);
        if(push) this.semantics.memory.virtualMemory[scopeMem][typeMem].push(value);
        this.operands.push(address);
        this.types.push(type);
    }

    processAssign(operator, line) {
        const [rightO, leftO] = [this.operands.pop(), this.operands.pop()];
        const [rightT, leftT] = [this.types.pop(), this.types.pop()];
        this.semantics.semantiConstants.CUBE.validOperation(rightT, leftT, operator, line);
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
        
        //TODO: Regresar var a valor inicial?

        this.jumps.push(this.quadruples.length);
        const type = this.semantics.semantiConstants.CUBE.validOperation(forStartT, forEndT, '<', line);
        const address = this.semantics.memory.assignMemory("local", type, true);
        const typeMem = this.semantics.memory.getTypeFromAddress(address);
        this.semantics.functionsTable[this.semantics.scopeStack.peek()].resources[typeMem]++;
        this.quadruples.push(["<", forStart, forEnd, address]);
        this.jumps.push(this.quadruples.length);
        this.quadruples.push(["gotoF", address, null, null]);
        this.operands.push(forStart);
    }

    endFor() {
        const forStart = this.operands.pop();
        this.processConstant(1, "INT");
        this.types.pop();
        this.quadruples.push(["+", forStart, this.operands.pop(), forStart]);
        const jumpForDone = this.jumps.pop();
        const jumpFor = this.jumps.pop();
        this.quadruples.push(["goto", null, null, jumpFor]);
        this.quadruples[jumpForDone][3] = this.quadruples.length;
    }

    createFunctionJump() {
        const jump = this.quadruples.length + this.semantics.functionsTable[this.semantics.currentFunctionCall].paramsTable.length * 2 + 4;
        this.processConstant(jump, 'INT');
        const address =  this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${this.semantics.currentFunctionCall}Return`].address;
        this.quadruples.push(["=", address, this.operands.pop(), null]);
        this.types.pop();

        const paramsTable = this.semantics.functionsTable[this.semantics.currentFunctionCall].paramsTable;
        let temps = [];
        for(let i = paramsTable.length-1; i >= 0; i--) {
            const operand = this.operands.pop();
            let address;
            if(this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${paramsTable[i].id}`] != undefined) {
                address = this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${paramsTable[i].id}`].address
            } else {
                address = this.semantics.memory.assignMemory("global", paramsTable[i].type, false);
                this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${paramsTable[i].id}`] = {
                    type: paramsTable[i].type,
                    address,
                }
            }
            temps.unshift(address);
            this.quadruples.push(["=", address, operand, null]);
        }
        this.quadruples.push(["init", this.semantics.currentFunctionCall, null, null]);

        const returnLocal = this.semantics.functionsTable[this.semantics.currentFunctionCall].variablesTable[`_${this.semantics.currentFunctionCall}ReturnLocal`].address;
        const ret = this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${this.semantics.currentFunctionCall}Return`].address;
        this.quadruples.push(["=", returnLocal, ret, null]);

        temps.forEach((temp, i) => {
            this.quadruples.push(["=", paramsTable[i].address, temp, null]);
        });

        const funcStart = this.semantics.functionsTable[this.semantics.currentFunctionCall].start;
        const type = this.semantics.functionsTable[this.semantics.currentFunctionCall].type;
        this.quadruples.push(["goto", null, null, funcStart]);
        const addressTemp = this.semantics.memory.assignMemory("local", type, true);
        const addressRet =  this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${this.semantics.currentFunctionCall}`].address;
        this.quadruples.push(["=", addressTemp, addressRet, null]);
        this.operands.push(addressTemp);
        this.types.push(type);
    }

    createReturnFromFunction(id) {
        //console.log(this.operands.peek());
    }

    createParam(line) {
        const type = this.types.pop();
        const param = this.semantics.functionsTable[this.semantics.currentFunctionCall].paramsTable[this.semantics.paramsCounter];
        if(param.type != type) {
            throw new Error(`Wrong parameter type on line ${line}`);
        }
        this.semantics.paramsCounter++;
    }

    returnFromFunction(scope) {
        const address =  this.semantics.functionsTable[scope].variablesTable[`_${scope}ReturnLocal`].address;
        const addressGlobal =  this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${scope}Return`].address;
        this.quadruples.push(["=", addressGlobal, address, null])
        this.quadruples.push(["popScope", null, null, null]);
        this.quadruples.push(["goto", "value", null, addressGlobal]);
        //TODO: solo se hace el popScope cuando tiene un return
    }

    handleReturn(line) {
        const operand = this.operands.pop();
        const type = this.types.pop();
        const scope = this.semantics.scopeStack.peek();
        if(this.semantics.functionsTable[scope].type != type) {
            throw new Error(`Wrong return type on line ${line}`);
        }
        const address =  this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${scope}`].address;
        this.quadruples.push(["=", address, operand, null]);
        this.returnFromFunction(scope);
    }

}

module.exports = Quadruple;