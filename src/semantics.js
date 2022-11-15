const {Stack} = require('datastructures-js');
const semantiConstants = require('./semantic-constants.js');
const Memory = require('./memory.js');

class Semantics {
    constructor() {
        this.globalName = "";
        this.scopeStack = new Stack([undefined]);
        this.currentType = "VOID";
        this.functionsTable = {};
        this.constsTable = {};
        this.semantiConstants = semantiConstants;
        this.memory = new Memory();
        this.currentFunctionCall = "";
        this.paramsCounter = 0;
        this.expectedParams = 0;
    }

    createFunction(id, line, start){
        if(this.functionsTable[id]){
            throw new Error(`Duplicated function name ${id} on line ${line}`);
        }
        let resourcesSize = 10;
        if(id == this.globalName) resourcesSize = 5;
        this.functionsTable[id] = {
            type: this.currentType,
            prevScope: this.scopeStack.peek(),
            variablesTable: {},
            paramsTable: [],
            start: start,
            resources: new Array(resourcesSize).fill(0)
        }
        if(this.currentType != "VOID") {
            const address = this.memory.assignMemory("global", this.currentType, false);
            this.functionsTable[this.globalName].variablesTable[`_${id}`] = {
                type: this.currentType,
                address
            }
        }
        if(id != "Baky"){
            const address = this.memory.assignMemory("global", this.currentType, false);
            this.functionsTable[this.globalName].variablesTable[`_${id}Return`] = {
                type: this.currentType,
                address
            }
            
        }
        this.scopeStack.push(id);
        this.memory.resetLocalMemory();
        if(id != "Baky"){
            const addressLocal = this.memory.assignMemory("local", this.currentType, false);
            this.functionsTable[id].variablesTable[`_${id}ReturnLocal`] = {
                type: this.currentType,
                address: addressLocal
            }
        }
    }

    createVariable(id, line){
        const currentScope = this.scopeStack.peek();
        if(this.functionsTable[currentScope].variablesTable[id]){
            throw new Error(`Duplicated variable name ${id} on line ${line} on scope ${currentScope}`);
        }
        let scopeMem = "local";
        if(currentScope == this.globalName) scopeMem = "global";
        const address = this.memory.assignMemory(scopeMem, this.currentType, false);
        const typeMem = this.memory.getTypeFromAddress(address);
        this.functionsTable[currentScope].resources[typeMem]++;
        this.functionsTable[currentScope].variablesTable[id] = {
            type: this.currentType,
            address: address
        }
    }

    createVariableArray(id, line, supertype, dimensions){
        const currentScope = this.scopeStack.peek();
        if(this.functionsTable[currentScope].variablesTable[id]){
            throw new Error(`Duplicated variable name ${id} on line ${line} on scope ${currentScope}`);
        }
        this.functionsTable[currentScope].variablesTable[id] = {
            type: this.currentType,
            supertype: supertype,
            dimensions: dimensions,
        }
    }

    validateFunction(id, line){
        if(!this.functionsTable[id] || id == this.globalName){
            throw new Error(`Undeclared function ${id} on line ${line}`);
        }
        this.currentFunctionCall = id;
        this.paramsCounter = 0;
        this.expectedParams = this.functionsTable[id].paramsTable.length;
    }

    validateParams(line){
        if(this.paramsCounter != this.expectedParams) {
            throw new Error(`Number of parameters doesn't match function definition for ${this.currentFunctionCall} in line ${line}`);
        }
    }

    validateVariable(id, line, supertype){
        let currentScope = this.scopeStack.peek();
        let foundScope = undefined;
        let variable;

        while(currentScope != undefined && foundScope == undefined) {
            if(this.functionsTable[currentScope].variablesTable[id]){
                foundScope = currentScope;
                variable = this.functionsTable[currentScope].variablesTable[id];
            }
            currentScope = this.functionsTable[currentScope].prevScope;
        }

        if(foundScope == undefined) throw new Error(`Undeclared variable ${id} on line ${line}`);
        if(supertype == "" && this.functionsTable[foundScope].variablesTable[id].supertype) throw new Error(`Missing indexes, variable ${id} on line ${line}`);
        if(supertype == "ARRAY" && this.functionsTable[foundScope].variablesTable[id].supertype != "ARRAY") throw new Error(`Not an array, variable ${id} on line ${line}`);
        if(supertype == "MATRIX" && this.functionsTable[foundScope].variablesTable[id].supertype != "MATRIX") throw new Error(`Not a matrix, variable ${id} on line ${line}`);
        return variable;
    }

    createParameter(id, line){
        const currentScope = this.scopeStack.peek();
        if(this.functionsTable[currentScope].variablesTable[id]){
            throw new Error(`Duplicated variable name ${id} on line ${line} on scope ${currentScope}`);
        }
        let scopeMem = "local";
        if(currentScope == this.globalName) scopeMem = "global";
        const address = this.memory.assignMemory(scopeMem, this.currentType, false);
        this.functionsTable[currentScope].variablesTable[id] = {
            type: this.currentType,
            address
        }
        this.functionsTable[currentScope].paramsTable.push({
            type: this.currentType,
            id: id,
            address
        });
    }
}

module.exports = Semantics;