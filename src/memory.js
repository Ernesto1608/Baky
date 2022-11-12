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
        }
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