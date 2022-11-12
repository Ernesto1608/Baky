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
            },
            cons: {
                INT: 15000,
                DOUBLE: 16000,
                STRING: 17000,
                CHAR: 18000,
                BOOLEAN: 19000,
            }
        };
        this.virtualMemory = [
            [
                [],[],[],[],[]
            ],
            [],
            [
                [],[],[],[],[]
            ]
        ];
    }

    getScopeFromAddress(address) {
        if(address >= 0 && address < 5000) return 0;
        if(address >= 5000 && address < 15000) return 1;
        if(address >= 15000 && address < 20000) return 2;
    }

    getTypeFromAddress(address) {
        if(address >= 0 && address < 1000 || address >= 5000 && address < 6000 || address >= 15000 && address < 16000) return 0;
        if(address >= 1000 && address < 2000 || address >= 6000 && address < 7000 || address >= 16000 && address < 17000) return 1;
        if(address >= 2000 && address < 3000 || address >= 7000 && address < 8000 || address >= 17000 && address < 18000) return 2;
        if(address >= 3000 && address < 4000 || address >= 8000 && address < 9000 || address >= 18000 && address < 19000) return 3;
        if(address >= 4000 && address < 5000 || address >= 9000 && address < 10000 || address >= 19000 && address < 20000) return 4;
        if(address >= 10000 && address < 11000) return 5;
        if(address >= 11000 && address < 12000) return 6;
        if(address >= 12000 && address < 13000) return 7;
        if(address >= 13000 && address < 14000) return 8;
        if(address >= 14000 && address < 15000) return 9;
    }

    fillGlobalMemory(resources) {
        this.virtualMemory[0] = [
            new Array(resources[0]).fill(0),
            new Array(resources[1]).fill(0),
            new Array(resources[2]).fill(""),
            new Array(resources[3]).fill(''),
            new Array(resources[4]).fill(false),
        ];
    }

    assignMemory(scope, type, temp) {
        let typeMem = type;
        if(temp) typeMem = 'T' + typeMem;
        this.allocation[scope][typeMem]++;
        if(this.allocation[scope][typeMem] % 1000 == 0) {
            throw new Error(`Out of memory for ${scope} of type ${typeMem}`);
        }
        return this.allocation[scope][typeMem]-1;
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
        };
    }
}

module.exports = Memory;