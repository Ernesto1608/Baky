// El trabajo de este archivo es manejar los cuadruplos del programa.

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

    // Procesa el siguiente operador en el stack de operadores
    // y genera un cuadruplo con los operandos y empuja el resultado a
    // el stack de operandos con su tipo
    processOperator(operator, line) {
        const [rightO, leftO] = [this.operands.pop(), this.operands.pop()];
        const [rightT, leftT] = [this.types.pop(), this.types.pop()];
        const type = this.semantics.semantiConstants.CUBE.validOperation(leftT, rightT, operator, line);
        const address = this.semantics.memory.assignMemory("local", type, true, 1);
        const typeMem = this.semantics.memory.getTypeFromAddress(address);
        this.semantics.functionsTable[this.semantics.scopeStack.peek()].resources[typeMem]++;
        this.quadruples.push([operator, leftO, rightO, address]);
        this.operands.push(address);
        this.types.push(type);
        this.operators.pop();
    }

    // Si una constante ya existe agrega la direccion a el stack de operadores
    // sino genera una direccion, la asigna el valor constante y agrega la direccion a el stack
    processConstant(value, type) {
        let address, push = true;
        if(this.semantics.constsTable[value] != undefined){
            push = false;
            address = this.semantics.constsTable[value];
        } else {
            address = this.semantics.memory.assignMemory("cons", type, false, 1);
            this.semantics.constsTable[value] = address;
        }
        const scopeMem = this.semantics.memory.getScopeFromAddress(address);
        const typeMem = this.semantics.memory.getTypeFromAddress(address);
        if(push) this.semantics.memory.virtualMemory[scopeMem][typeMem].push(value);
        this.operands.push(address);
        this.types.push(type);
    }

    // Procesa una assignacion y genera el cuadruplo
    processAssign(operator, line) {
        const [rightO, leftO] = [this.operands.pop(), this.operands.pop()];
        const [rightT, leftT] = [this.types.pop(), this.types.pop()];
        this.semantics.semantiConstants.CUBE.validOperation(leftT, rightT, operator, line);
        this.quadruples.push([operator, leftO, rightO, null]);
        this.operators.pop();
    }

    // Obtiene y regresa la direccion de memoria de una posicion de un arreglo
    processArray(variable, line) {
        const [rightO] = [this.operands.pop()];
        const [rightT] = [this.types.pop()];
        if(rightT != "INT") throw new Error(`Array index must be int on line ${line}`);
        this.quadruples.push(["ver", rightO, 0, variable.dimensions[0]]);
        this.processConstant(variable.address, "INT");
        this.types.pop();

        const address = this.semantics.memory.assignMemory("local", "POINTER", true, 1);
        const typeMem = this.semantics.memory.getTypeFromAddress(address);
        this.semantics.functionsTable[this.semantics.scopeStack.peek()].resources[typeMem]++;
        this.quadruples.push(["sumP", rightO, this.operands.pop(), address]);
        return address;
    }

    // Obtiene y regresa la direccion de memoria de una posicion de una matriz
    processMatrix(variable) {
        const [colO, rowO] = [this.operands.pop(), this.operands.pop()];
        const [colT, rowT] = [this.types.pop(), this.types.pop()];
        if(colT != "INT" || rowT != "INT") throw new Error(`Matrix index must be int on line ${line}`);
        this.quadruples.push(["ver", rowO, 0, variable.dimensions[0]]);
        this.quadruples.push(["ver", colO, 0, variable.dimensions[1]]);

        const address = this.semantics.memory.assignMemory("local", "INT", true, 1);
        let typeMem = this.semantics.memory.getTypeFromAddress(address);
        this.semantics.functionsTable[this.semantics.scopeStack.peek()].resources[typeMem]++;
        this.processConstant(variable.dimensions[1], "INT");
        this.types.pop();
        this.quadruples.push(["*", rowO, this.operands.pop(), address]);
        this.quadruples.push(["+", address, colO, address]);

        this.processConstant(variable.address, "INT");
        this.types.pop();

        const addressP = this.semantics.memory.assignMemory("local", "POINTER", true, 1);
        typeMem = this.semantics.memory.getTypeFromAddress(addressP);
        this.semantics.functionsTable[this.semantics.scopeStack.peek()].resources[typeMem]++;
        this.quadruples.push(["sumP", address, this.operands.pop(), addressP]);
        return addressP;
    }

    // Genera el cuadruplo de escritura
    processWrite(line) {
        const [rightO] = [this.operands.pop()];
        const [rightT] = [this.types.pop()];
        if(rightT == "VOID") throw new Error(`Cannot write void value on line ${line}`); 
        this.quadruples.push(["write", rightO, null, null]);
    }

    // Genera el cuadruplo de lectura
    processRead() {
        const [rightO] = [this.operands.pop()];
        const [rightT] = [this.types.pop()];
        this.quadruples.push(["read", rightO, null, null]);
    }

    // Genera el cuadruplo de salto para un if y agrega la posicion del cuadruplo al stack de saltos
    processIf(line) {
        const [rightO] = [this.operands.pop()];
        const [rightT] = [this.types.pop()];
        if(rightT != this.semantics.semantiConstants.TYPE.BOOLEAN) throw new Error(`Conditions must have type boolean on line ${line}`);    
        this.quadruples.push(["gotoF", rightO, null, null]);
        this.jumps.push(this.quadruples.length-1);
    }

    // Genera el cuadruplo de salto para un else y agrega la posicion del cuadruplo al stack de saltos
    // tambien llama returnIf
    processElse() {
        this.quadruples.push(["goto", null, null, null]);
        this.returnIf();
        this.jumps.push(this.quadruples.length-1);
    }

    // Obtiene la posicion a donde un if tiene que saltar y la assigna al cuadruplo
    returnIf() {
        const jump = this.jumps.pop();
        this.quadruples[jump][3] = this.quadruples.length;
    }

    // Guarda en el stack de saltos la posicion del cuadruplo
    storeWhile() {
        this.jumps.push(this.quadruples.length);
    }

    // Utilizando los saltos assigna en las posiciones correspondientes
    // a donde saltar para el ciclo while
    returnWhile() {
        const jumpDone = this.jumps.pop();
        const jumpWhile = this.jumps.pop();
        this.quadruples.push(["goto", null, null, jumpWhile]);
        this.quadruples[jumpDone][3] = this.quadruples.length;
    }

    // Genera la condicion del for y el cuadruplo para saltar
    // cuando esta no se cumpla y agregar el la posicion al stack de saltos
    processFor(line) {
        const forEnd = this.operands.pop();
        const forEndT = this.types.pop();
        const forStart = this.operands.pop();
        const forStartT = this.types.pop();
        if (forStartT != "INT" && forStartT != "DOUBLE" || forEndT != "INT" && forEndT != "DOUBLE") throw new Error(`For must have int or double on line ${line}`);

        this.jumps.push(this.quadruples.length);
        const type = this.semantics.semantiConstants.CUBE.validOperation(forStartT, forEndT, '<', line);
        const address = this.semantics.memory.assignMemory("local", type, true, 1);
        const typeMem = this.semantics.memory.getTypeFromAddress(address);
        this.semantics.functionsTable[this.semantics.scopeStack.peek()].resources[typeMem]++;
        this.quadruples.push(["<", forStart, forEnd, address]);
        this.jumps.push(this.quadruples.length);
        this.quadruples.push(["gotoF", address, null, null]);
        this.operands.push(forStart);
    }

    // Le agrega 1 al contador del for, genera el salto para
    // regresar a la condicion y asigna el salto al cuadruplo
    // de cuando no se cumple la condicion del for.
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

    // Assigna variables globales con los valores de los parametros,
    // entra a la funcion y los pasa a los valores locales de los parametros
    createFunctionJump() {
        const paramsTable = this.semantics.functionsTable[this.semantics.currentFunctionCall].paramsTable;
        let temps = [];
        for(let i = paramsTable.length-1; i >= 0; i--) {
            const operand = this.operands.pop();
            let address;
            if(this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${paramsTable[i].id}`] != undefined) {
                address = this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${paramsTable[i].id}`].address
            } else {
                address = this.semantics.memory.assignMemory("global", paramsTable[i].type, false, 1);
                this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${paramsTable[i].id}`] = {
                    type: paramsTable[i].type,
                    address,
                }
            }
            temps.unshift(address);
            this.quadruples.push(["=", address, operand, null]);
        }
        this.quadruples.push(["init", this.semantics.currentFunctionCall, null, null]);

        temps.forEach((temp, i) => {
            this.quadruples.push(["=", paramsTable[i].address, temp, null]);
        });

        const funcStart = this.semantics.functionsTable[this.semantics.currentFunctionCall].start;
        const type = this.semantics.functionsTable[this.semantics.currentFunctionCall].type;
        this.quadruples.push(["gosub", null, null, funcStart]);
        if(type != "VOID"){
            const addressTemp = this.semantics.memory.assignMemory("local", type, true, 1);
            const addressRet =  this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${this.semantics.currentFunctionCall}`].address;
            this.quadruples.push(["=", addressTemp, addressRet, null]);
            this.operands.push(addressTemp);
        } else {
            this.operands.push('_');
        }
        this.types.push(type);
    }

    // Checa el numero de parametros y el tipo con la declaracion de la funcion
    createParam(line) {
        if(this.semantics.expectedParams < this.semantics.paramsCounter + 1) {
            throw new Error(`Number of parameters doesn't match function definition for ${this.currentFunctionCall} in line ${line}`);
        }
        const type = this.types.pop();
        const param = this.semantics.functionsTable[this.semantics.currentFunctionCall].paramsTable[this.semantics.paramsCounter];
        if(param.type != type) {
            throw new Error(`Wrong parameter type on line ${line}`);
        }
        this.semantics.paramsCounter++;
    }

    // Al terminar una funcion borrar la memoria
    returnFromFunction(scope) {
        if(!this.semantics.functionsTable[scope].return && this.semantics.functionsTable[scope].type != "VOID") {
            throw new Error(`Mising return on function '${scope}'`);
        }
        this.quadruples.push(["popScope", null, null, null]);
    }

    // Assignar el valor de retorno a una variable global
    handleReturn(line) {
        const operand = this.operands.pop();
        const type = this.types.pop();
        const scope = this.semantics.scopeStack.peek();
        this.semantics.functionsTable[scope].return = true;
        if(this.semantics.functionsTable[scope].type == "VOID") {
            throw new Error(`Unexpected return on line ${line}`);
        }
        if(this.semantics.functionsTable[scope].type != type) {
            throw new Error(`Wrong return type on line ${line}`);
        }
        const address =  this.semantics.functionsTable[this.semantics.globalName].variablesTable[`_${scope}`].address;
        this.quadruples.push(["=", address, operand, null]);
        this.returnFromFunction(scope);
    }

}

module.exports = Quadruple;