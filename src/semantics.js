const {Stack} = require('datastructures-js');
const semantiConstants = require('./semantic-constants.js');

class Semantics {
    constructor() {
        this.globalName = "";
        this.scopeStack = new Stack([undefined]);
        this.currentType = "VOID";
        this.functionsTable = {};
    }

    createFunction(id, line){
        if(this.functionsTable[id]){
            throw new Error(`Duplicated function name ${id} on line ${line}`);
        }
        this.functionsTable[id] = {
            type: this.currentType,
            prevScope: this.scopeStack.peek(),
            variablesTable: {}
        }
        this.scopeStack.push(id);
    }

    createVariable(id, line){
        const currentScope = this.scopeStack.peek();
        if(this.functionsTable[currentScope].variablesTable[id]){
            throw new Error(`Duplicated variable name ${id} on line ${line} on scope ${currentScope}`);
        }
        this.functionsTable[currentScope].variablesTable[id] = {
            type: this.currentType,
            value: semantiConstants.INITVALUES[this.currentType]
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
            value: semantiConstants.INITVALUES[this.currentType]
        }
    }

    validateFunction(id, line){
        if(!this.functionsTable[id] || id == this.globalName){
            throw new Error(`Undeclared function ${id} on line ${line}`);
        }
    }

    validateVariable(id, line, supertype){
        let currentScope = this.scopeStack.peek();
        let foundScope = undefined;

        while(currentScope != undefined && foundScope == undefined) {
            if(this.functionsTable[currentScope].variablesTable[id]){
                foundScope = currentScope;
            }
            currentScope = this.functionsTable[currentScope].prevScope;
        }

        if(foundScope == undefined) throw new Error(`Undeclared variable ${id} on line ${line}`);
        if(supertype == "" && this.functionsTable[foundScope].variablesTable[id].supertype) throw new Error(`Missing indexes, variable ${id} on line ${line}`);
        if(supertype == "ARRAY" && this.functionsTable[foundScope].variablesTable[id].supertype != "ARRAY") throw new Error(`Not an array, variable ${id} on line ${line}`);
        if(supertype == "MATRIX" && this.functionsTable[foundScope].variablesTable[id].supertype != "MATRIX") throw new Error(`Not a matrix, variable ${id} on line ${line}`);
    }
}

module.exports = Semantics;