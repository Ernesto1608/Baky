// Archivo con la maquina virtual que procesa los cuadruplos

const { Stack } = require("datastructures-js");

class VM {
    constructor(quadruple, addLog, getInput) {
        this.quadruple = quadruple;
        this.functionsSize = {};
        this.returns = new Stack();
        this.addLog = addLog;
        this.getInput = getInput;
        this.log = "";
    }

    async run() {
        let quads = this.quadruple.quadruples;

        let start = this.quadruple.semantics.functionsTable['Baky'].start;

        let memory = this.quadruple.semantics.memory;

        memory.pushMemoryStack(this.quadruple.semantics.functionsTable['Baky'].resources);

        let value, type;
        // Ciclo para recorrer los cuadruplos
        for(let i = start; i < quads.length; i++) {
            // Switch para procesar cada codigo de operacion
            switch(quads[i][0]) {
                case '+':
                    value = memory.getValueFromAddress(quads[i][1]) + memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case 'sumP':
                    value = memory.getValueFromAddress(quads[i][1]) + memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddressPointer(quads[i][3], value);
                    break;
                case '-':
                    value = memory.getValueFromAddress(quads[i][1]) - memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case '/':
                    value = memory.getValueFromAddress(quads[i][1]) / memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case '*':
                    value = memory.getValueFromAddress(quads[i][1]) * memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case '=':                    
                    value = memory.getValueFromAddress(quads[i][2]);
                    type = memory.getTypeFromAddress(quads[i][1]);
                    if (type == 0 || type == 5) {
                        value = parseInt(value);
                    }
                    memory.assignToAddress(quads[i][1], value);
                    break;
                case '<':
                    value = memory.getValueFromAddress(quads[i][1]) < memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case '>':
                    value = memory.getValueFromAddress(quads[i][1]) > memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case '==':
                    value = memory.getValueFromAddress(quads[i][1]) == memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case '>=':
                    value = memory.getValueFromAddress(quads[i][1]) >= memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case '<=':
                    value = memory.getValueFromAddress(quads[i][1]) <= memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case '!=':
                    value = memory.getValueFromAddress(quads[i][1]) != memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case '&&':
                    value = memory.getValueFromAddress(quads[i][1]) && memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case '||':
                    value = memory.getValueFromAddress(quads[i][1]) || memory.getValueFromAddress(quads[i][2]);
                    memory.assignToAddress(quads[i][3], value);
                    break;
                case 'write':
                    value = memory.getValueFromAddress(quads[i][1]);
                    this.log += value;
                    break;
                case 'end':
                    if(this.log != ""){
                        const lines = this.log.split('endl');
                        lines.forEach(element => this.addLog("(BAKY) " + element));
                        this.log = "";
                    }
                    break;
                case 'read':
                    if(this.log != "") {
                        const lines = this.log.split('endl');
                        lines.forEach(element => this.addLog("(BAKY) " + element));
                        this.log = "";
                    }
                    type = memory.getTypeFromAddress(quads[i][1]);
                    if(type == 10) type = memory.getTypeFromAddress(memory.getValueFromPointer(quads[i][1]));
                    let error = false;
                    value = await this.getInput();
                    switch (type) { 
                        case 0:
                            if(value.match("[+-]?[0-9]+")){
                                value = parseInt(value);
                            } else error = true;
                            break;
                        case 1:
                            if(value.match("[+-]?[0-9]+")){
                                value = parseFloat(value);
                            } else error = true;
                            break;
                        case 3:
                            if(value.length == 1){
                                value = value.charAt(0);
                            } else error = true;
                            break;
                        case 4:
                            if(value.match("(true|false)")){
                                value = (value == "true");
                            } else error = true;
                            break;
                    }
                    if (error) {
                        this.addLog(`(Error) Unable to cast ${value} to type ${type == 0 ? "INT" : type == 1 ? "DOUBLE" : type == 3 ? "CHAR" : "BOOLEAN"}`);
                        i = quads.length;
                        break;
                    }
                    memory.assignToAddress(quads[i][1], value);
                    break;
                case 'gotoF':
                    value = memory.getValueFromAddress(quads[i][1]);
                    if(value == false) { 
                        i = quads[i][3]-1;
                    }
                    break;
                case 'goto':
                    i = quads[i][3]-1;
                    break;
                case 'gosub':
                    this.returns.push(i);
                    i = quads[i][3]-1;
                    break;
                case 'init':
                    memory.pushMemoryStack(this.quadruple.semantics.functionsTable[quads[i][1]].resources);
                    break;
                case 'popScope':
                    memory.virtualMemory[1].pop();
                    i = this.returns.pop();
                    break;
                case 'ver':
                    value = memory.getValueFromAddress(quads[i][1]);
                    if(value < quads[i][2] || value >= quads[i][3]) {
                        this.addLog(`(Error) Value '${value}' out of bounds for array`);
                        i = quads.length;
                    }
                    break;
                case 'returnError':
                    this.addLog(`(Error) Expecting valid return on function '${quads[i][1]}'`);
                    i = quads.length;
                    break;
            }
        }
    }
}

module.exports = VM;