const OPERATOR = Object.freeze({
    OR: '||',
    AND: '&&',
    EQ: '==',
    NOT_EQUAL: '!=',
    GREATER_THAN: '>',
    GREATER_OR_EQ_THAN: '>=',
    LESS_THAN: '<',
    LESS_OR_EQ_THAN: '<=',
    PLUS: '+',
    MINUS: '-',
    TIMES: '*',
    DIVIDED: '/',
});

const TYPE = Object.freeze({
    INT: 'INT',
    DOUBLE: 'DOUBLE',
    STRING: 'STRING',
    CHAR: 'CHAR',
    BOOLEAN: 'BOOLEAN',
});

const INITVALUES = Object.freeze({
    INT: 0,
    DOUBLE: 0,
    STRING: "",
    CHAR: '',
    BOOLEAN: false,
});

const CUBE = Object.freeze({
    [TYPE.INT]: {
        [TYPE.INT]: {
            [OPERATOR.PLUS]: TYPE.INT,
            [OPERATOR.MINUS]: TYPE.INT,
            [OPERATOR.TIMES]: TYPE.INT,
            [OPERATOR.DIVIDED]: TYPE.DOUBLE,
            [OPERATOR.EQ]: TYPE.BOOLEAN,
            [OPERATOR.NOT_EQUAL]: TYPE.BOOLEAN,
            [OPERATOR.GREATER_THAN]: TYPE.BOOLEAN,
            [OPERATOR.GREATER_OR_EQ_THAN]: TYPE.BOOLEAN,
            [OPERATOR.LESS_THAN]: TYPE.BOOLEAN,
            [OPERATOR.LESS_OR_EQ_THAN]: TYPE.BOOLEAN,
        },
        [TYPE.DOUBLE]: {
            [OPERATOR.PLUS]: TYPE.DOUBLE,
            [OPERATOR.MINUS]: TYPE.DOUBLE,
            [OPERATOR.TIMES]: TYPE.DOUBLE,
            [OPERATOR.DIVIDED]: TYPE.DOUBLE,
            [OPERATOR.EQ]: TYPE.BOOLEAN,
            [OPERATOR.NOT_EQUAL]: TYPE.BOOLEAN,
            [OPERATOR.GREATER_THAN]: TYPE.BOOLEAN,
            [OPERATOR.GREATER_OR_EQ_THAN]: TYPE.BOOLEAN,
            [OPERATOR.LESS_THAN]: TYPE.BOOLEAN,
            [OPERATOR.LESS_OR_EQ_THAN]: TYPE.BOOLEAN,
        },
    },
    [TYPE.DOUBLE]: {
        [TYPE.DOUBLE]: {
            [OPERATOR.PLUS]: TYPE.DOUBLE,
            [OPERATOR.MINUS]: TYPE.DOUBLE,
            [OPERATOR.TIMES]: TYPE.DOUBLE,
            [OPERATOR.DIVIDED]: TYPE.DOUBLE,
            [OPERATOR.EQ]: TYPE.BOOLEAN,
            [OPERATOR.NOT_EQUAL]: TYPE.BOOLEAN,
            [OPERATOR.GREATER_THAN]: TYPE.BOOLEAN,
            [OPERATOR.GREATER_OR_EQ_THAN]: TYPE.BOOLEAN,
            [OPERATOR.LESS_THAN]: TYPE.BOOLEAN,
            [OPERATOR.LESS_OR_EQ_THAN]: TYPE.BOOLEAN,
        },
        [TYPE.INT]: {
            [OPERATOR.PLUS]: TYPE.DOUBLE,
            [OPERATOR.MINUS]: TYPE.DOUBLE,
            [OPERATOR.TIMES]: TYPE.DOUBLE,
            [OPERATOR.DIVIDED]: TYPE.DOUBLE,
            [OPERATOR.EQ]: TYPE.BOOLEAN,
            [OPERATOR.NOT_EQUAL]: TYPE.BOOLEAN,
            [OPERATOR.GREATER_THAN]: TYPE.BOOLEAN,
            [OPERATOR.GREATER_OR_EQ_THAN]: TYPE.BOOLEAN,
            [OPERATOR.LESS_THAN]: TYPE.BOOLEAN,
            [OPERATOR.LESS_OR_EQ_THAN]: TYPE.BOOLEAN,
        },
    },
    [TYPE.STRING]: {
        [TYPE.STRING]: {
            [OPERATOR.EQ]: TYPE.BOOLEAN,
            [OPERATOR.NOT_EQUAL]: TYPE.BOOLEAN,
        },
    },
    [TYPE.CHAR]: {
        [TYPE.CHAR]: {
            [OPERATOR.EQ]: TYPE.BOOLEAN,
            [OPERATOR.NOT_EQUAL]: TYPE.BOOLEAN,
        },
    },
    [TYPE.BOOLEAN]: {
        [TYPE.BOOLEAN]: {
            [OPERATOR.EQ]: TYPE.BOOLEAN,
            [OPERATOR.NOT_EQUAL]: TYPE.BOOLEAN,
            [OPERATOR.OR]: TYPE.BOOLEAN,
            [OPERATOR.AND]: TYPE.BOOLEAN,
        },
    },
    validOperation: function(type1, type2, operator, line) {
        if (this[type1][type2][operator]) return this[type1][type2][operator];
        throw new Error(`Invalid operation ${type1} ${operator} ${type2} on line ${line}`);
    }
});

module.exports = {
    OPERATOR,
    TYPE,
    CUBE,
    INITVALUES
};