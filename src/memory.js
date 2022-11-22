// Archivo encargado de manejar la memoria del programa.
// Se utiliza en compliacion para obtener las direcciones de memoria
// y en ejecucion para acceder a la memoria.

const { Stack } = require("datastructures-js");

class Memory {
    constructor() {
        this.allocation = {
            global: {
                INT: 0,
                DOUBLE: 1000,
                STRING: 2000,
                CHAR: 3000,
                BOOLEAN: 4000,
            },
            local: {
                INT: 5000,
                DOUBLE: 6000,
                STRING: 7000,
                CHAR: 8000,
                BOOLEAN: 9000,
                TINT: 10000,
                TDOUBLE: 11000,
                TSTRING: 12000,
                TCHAR: 13000,
                TBOOLEAN: 14000,
                TPOINTER: 15000,
            },
            cons: {
                INT: 16000,
                DOUBLE: 17000,
                STRING: 18000,
                CHAR: 19000,
                BOOLEAN: 20000,
            }
        };
        this.virtualMemory = [
            [
                [],[],[],[],[]
            ],
            new Stack(),
            [
                [],[],[],[],[]
            ]
        ];
    }

    getScopeFromAddress(address) {
        if(address >= 0 && address < 5000) return 0;
        if(address >= 5000 && address < 16000) return 1;
        if(address >= 16000 && address < 21000) return 2;
    }

    getTypeFromAddress(address) {
        if(address >= 0 && address < 1000 || address >= 5000 && address < 6000 || address >= 16000 && address < 17000) return 0;
        if(address >= 1000 && address < 2000 || address >= 6000 && address < 7000 || address >= 17000 && address < 18000) return 1;
        if(address >= 2000 && address < 3000 || address >= 7000 && address < 8000 || address >= 18000 && address < 19000) return 2;
        if(address >= 3000 && address < 4000 || address >= 8000 && address < 9000 || address >= 19000 && address < 20000) return 3;
        if(address >= 4000 && address < 5000 || address >= 9000 && address < 10000 || address >= 20000 && address < 21000) return 4;
        if(address >= 10000 && address < 11000) return 5;
        if(address >= 11000 && address < 12000) return 6;
        if(address >= 12000 && address < 13000) return 7;
        if(address >= 13000 && address < 14000) return 8;
        if(address >= 14000 && address < 15000) return 9;
        if(address >= 15000 && address < 16000) return 10;
    }

    // Llenar la memoria global con valores default
    fillGlobalMemory(resources) {
        this.virtualMemory[0] = [
            new Array(resources[0]).fill(0),
            new Array(resources[1]).fill(0),
            new Array(resources[2]).fill(""),
            new Array(resources[3]).fill(''),
            new Array(resources[4]).fill(false),
        ];
    }

    // Agregar una memoria local al stack con valores default
    pushMemoryStack(resources) {
        this.virtualMemory[1].push([
            new Array(resources[0]).fill(0),
            new Array(resources[1]).fill(0),
            new Array(resources[2]).fill(""),
            new Array(resources[3]).fill(''),
            new Array(resources[4]).fill(false),
            new Array(resources[5]).fill(0),
            new Array(resources[6]).fill(0),
            new Array(resources[7]).fill(""),
            new Array(resources[8]).fill(''),
            new Array(resources[9]).fill(false),
            new Array(resources[10]).fill(0),
        ]);
    }

    // Generar la siguiente direccion de memoria para un cierto tipo y scope
    assignMemory(scope, type, temp, size) {
        let typeMem = type;
        if(temp) typeMem = 'T' + typeMem;
        let mem = this.allocation[scope][typeMem];
        let out = (mem%1000 + size) > 1000 ? true : false;
        this.allocation[scope][typeMem]+=size;
        if(this.allocation[scope][typeMem] % 1000 == 0 || out) {
            throw new Error(`Out of memory for ${scope} of type ${typeMem}`);
        }
        return mem;
    }

    resetLocalMemory() {
        this.allocation.local = {
            INT: 5000,
            DOUBLE: 6000,
            STRING: 7000,
            CHAR: 8000,
            BOOLEAN: 9000,
            TINT: 10000,
            TDOUBLE: 11000,
            TSTRING: 12000,
            TCHAR: 13000,
            TBOOLEAN: 14000,
            TPOINTER: 15000
        };
    }

    getValueFromAddress(address) {
        if(address >= 15000 && address < 16000) address = this.getValueFromPointer(address);
        const scopeMem = this.getScopeFromAddress(address);
        const typeMem = this.getTypeFromAddress(address);
        return scopeMem == 1 ? this.virtualMemory[scopeMem].peek()[typeMem][address % 1000] :
            this.virtualMemory[scopeMem][typeMem][address % 1000];
    }

    getValueFromPointer(address) {
        const scopeMem = this.getScopeFromAddress(address);
        const typeMem = this.getTypeFromAddress(address);
        return scopeMem == 1 ? this.virtualMemory[scopeMem].peek()[typeMem][address % 1000] :
            this.virtualMemory[scopeMem][typeMem][address % 1000];
    }

    assignToAddress(address, value) {
        if(address >= 15000 && address < 16000) address = this.getValueFromPointer(address);
        const scopeMem = this.getScopeFromAddress(address);
        const typeMem = this.getTypeFromAddress(address);
        if (scopeMem == 1) {
            this.virtualMemory[scopeMem].peek()[typeMem][address % 1000] = value;
        } else {
            this.virtualMemory[scopeMem][typeMem][address % 1000] = value;
        }
    }

    assignToAddressPointer(address, value) {
        const scopeMem = this.getScopeFromAddress(address);
        const typeMem = this.getTypeFromAddress(address);
        if (scopeMem == 1) {
            this.virtualMemory[scopeMem].peek()[typeMem][address % 1000] = value;
        } else {
            this.virtualMemory[scopeMem][typeMem][address % 1000] = value;
        }
    }
}

module.exports = Memory;