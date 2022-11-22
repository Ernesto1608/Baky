// Archivo con la maquina virtual que procesa los cuadruplos

const readline = require("readline");
const { Stack } = require("datastructures-js");

function askInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question("(input) ", ans => {
        rl.close();
        resolve(ans);
    }))
}

// Funcion para dividir los logs en diferentes lineas
function display(str) {
    const lines = str.split('endl');
    lines.forEach(element => console.log("(BAKY) " + element));
}

class VM {
    constructor(quadruple) {
        this.quadruple = quadruple;
        this.functionsSize = {};
        this.returns = new Stack();
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
                        display(this.log);
                        this.log = "";
                    }
                    break;
                case 'read':
                    if(this.log != ""){
                        display(this.log);
                        this.log = "";
                    }
                    type = memory.getTypeFromAddress(quads[i][1]);
                    if(type == 10) type = memory.getTypeFromAddress(memory.getValueFromPointer(quads[i][1]));
                    let error = false;
                    value = await askInput();
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
                        throw new Error(`Unable to cast ${value} to type ${type == 0 ? "INT" : type == 1 ? "DOUBLE" : type == 3 ? "CHAR" : "BOOLEAN"}`);
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
                        throw new Error(`Value '${value}' out of bounds for array`);
                    }
                    break;
                case 'returnError':
                    throw new Error(`Expecting valid return on function '${quads[i][1]}'`);
                    break;
            }
        }
    }
}

module.exports = VM;