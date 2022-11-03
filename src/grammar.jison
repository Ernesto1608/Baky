%lex
%{
    if (!yy.isReady) {
        yy.isReady = true;
        yy.mylineno = 1;
        const { quadruple } = yy.data;
        yy.quadruple = quadruple;
    }
%}
%%

"Baky" { return "BAKY"; }

"var" { return "VAR"; }

"int" { return "INT"; }
"double" { return "DOUBLE"; }
"string" { return "STRING"; }
"char" { return "CHAR"; }
"boolean" { return "BOOLEAN"; }

"function" { return "FUNCTION"; }

"void" { return "VOID"; }
"return" { return "RETURN"; }

"read" { return "READ"; }
"write" { return "WRITE"; }

"if" { return "IF"; }
"else" { return "ELSE"; }
"while" { return "WHILE"; }
"from" { return "FROM"; }
"to" { return "TO"; }
"do" { return "DO"; }

";" { return "SEMICOLON"; }
"," { return "COMA"; }
"[" { return "OPEN_SQUARE_BRACKET"; }
"]" { return "CLOSE_SQUARE_BRACKET"; }
"{" { return "OPEN_CURLY_BRACKET"; }
"}" { return "CLOSE_CURLY_BRACKET"; }
"(" { return "OPEN_PARENTHESIS"; }
")" { return "CLOSE_PARENTHESIS"; }
"=" { return "EQUAL"; }
"||" { return "OR"; }
"&&" { return "AND"; }
"+" { return "PLUS"; }
"-" { return "MINUS"; }
"*" { return "TIMES"; }
"/" { return "DIVIDED"; }
"==" { return "EQ"; }
"!=" { return "NOT_EQUAL"; }
"<=" { return "LESS_OR_EQ_THAN"; }
">=" { return "GREATER_OR_EQ_THAN"; }
"<" { return "LESS_THAN"; }
">" { return "GREATER_THAN"; }

(true|false) { return "BOOLEAN_VALUE"; }
[+-]?[0-9]+\.[0-9]+ { return "DOUBLE_VALUE"; }
[+-]?[0-9]+ { return "INT_VALUE"; }
\"[^\"]*\" { return "STRING_VALUE"; }
\'.\' { return "CHAR_VALUE"; }
[a-zA-z]\w* { return "ID"; }
\n {yy.mylineno++;}
(\t|\s) {}
. {throw new Error("Unsupported symbols on line " + yy.mylineno); }

/lex

%start baky

%%

//Neuralgic points definition 
@createProgram: {
    yy.quadruple.semantics.globalName = $1;
    yy.quadruple.semantics.createFunction($1, yy.mylineno);
};

@createFunction: {
    if($0 == "void") yy.quadruple.semantics.currentType = "VOID";
    yy.quadruple.semantics.createFunction($1, yy.mylineno);
};

@validateFunction: {
    yy.quadruple.semantics.validateFunction($0, yy.mylineno);
};

@popScope: {
    let currentScope = yy.quadruple.semantics.scopeStack.pop();
    // yy.quadruple.semantics.functionsTable[currentScope].variablesTable = {};
};

@createVariable: {
    yy.quadruple.semantics.createVariable($1, yy.mylineno);
};

@createVariableArray: {
    yy.quadruple.semantics.createVariableArray($-2, yy.mylineno, "ARRAY", [$0]);
};

@createVariableArrayParam: {
    yy.quadruple.semantics.createVariableArray($-1, yy.mylineno, "ARRAY", []);
};

@createVariableMatrix: {
    yy.quadruple.semantics.createVariableArray($-5, yy.mylineno, "MATRIX", [$-3, $0]);
};

@createVariableMatrixParam: {
    yy.quadruple.semantics.createVariableArray($-3, yy.mylineno, "MATRIX", []);
};

@validateForVariable: {
    let typeF = yy.quadruple.semantics.validateVariable($1, yy.mylineno, "");
    if (typeF != "INT" && typeF != "DOUBLE") throw new Error(`For must have int or double on line ${yy.mylineno}`);
    yy.quadruple.operands.push($1);
};

@processFor: {
    yy.quadruple.processFor();
};

@endFor: {
    yy.quadruple.endFor();
};

@validateVariable: {
    let typeV = yy.quadruple.semantics.validateVariable($1, yy.mylineno, "");
    yy.quadruple.operands.push($1);
    yy.quadruple.types.push(typeV);
};

@validateArray: {
    let typeA = yy.quadruple.semantics.validateVariable($-2, yy.mylineno, "ARRAY");
    yy.quadruple.operands.push($-2);
    yy.quadruple.types.push(typeA);
};

@validateMatrix: {
    let typeM = yy.quadruple.semantics.validateVariable($-5, yy.mylineno, "MATRIX");
    yy.quadruple.operands.push($-5);
    yy.quadruple.types.push(typeM);
};

@pushOperator: {
    yy.quadruple.operators.push($1);
};

@processOperatorN1: {
    let operatorN1 = yy.quadruple.operators.peek();
    while(operatorN1 == '*' || operatorN1 == '/') {
        yy.quadruple.processOperator(operatorN1, yy.mylineno);
        operatorN1 = yy.quadruple.operators.peek();
    }
};

@processOperatorN2: {
    let operatorN2 = yy.quadruple.operators.peek();
    while(operatorN2 == '+' || operatorN2 == '-') {
        yy.quadruple.processOperator(operatorN2, yy.mylineno);
        operatorN2 = yy.quadruple.operators.peek();
    }
};

@processOperatorN3: {
    let operatorN3 = yy.quadruple.operators.peek();
    while(operatorN3 == '==' || operatorN3 == '!=' || operatorN3 == '<' || operatorN3 == '<=' || operatorN3 == '>' || operatorN3 == '>=') {
        yy.quadruple.processOperator(operatorN3, yy.mylineno);
        operatorN3 = yy.quadruple.operators.peek();
    }
};

@processOperatorN4: {
    let operatorN4 = yy.quadruple.operators.peek();
    while(operatorN4 == '&&') {
        yy.quadruple.processOperator(operatorN4, yy.mylineno);
        operatorN4 = yy.quadruple.operators.peek();
    }
};

@processOperatorN5: {
    let operatorN5 = yy.quadruple.operators.peek();
    while(operatorN5 == '||') {
        yy.quadruple.processOperator(operatorN5, yy.mylineno);
        operatorN5 = yy.quadruple.operators.peek();
    }
};

@processAssign: {
    let operatorAssign = yy.quadruple.operators.peek();
    yy.quadruple.processAssign(operatorAssign, yy.mylineno);
};

@processWrite: {
    yy.quadruple.processWrite();
};

@processRead: {
    yy.quadruple.processRead();
};

@pushBottom: {
    yy.quadruple.operators.push($1);
};

@popBottom: {
    yy.quadruple.operators.pop();
};

@processIf: {
    yy.quadruple.processIf(yy.mylineno);
};

@processElse: {
    yy.quadruple.processElse();
};

@returnIf: {
    yy.quadruple.returnIf();
};

@storeWhile: {
    yy.quadruple.storeWhile();
};

@returnWhile: {
    yy.quadruple.returnWhile();
};

baky:
    BAKY ID @createProgram SEMICOLON vars funcs main {
        // yy.quadruple.semantics.functionsTable = {};
        // console.log(JSON.stringify(yy.quadruple.quadruples, null, 4));
        for(let i = 0; i < yy.quadruple.quadruples.length; i++) {
            console.log(i + " : " + JSON.stringify(yy.quadruple.quadruples[i], null, 4))
        }
        console.log(`Successful compilation of program ${yy.quadruple.semantics.globalName}`);
    };

vars: |
    vars_aux vars;

vars_aux: 
    VAR type vars_aux2 SEMICOLON;

vars_aux2:
    ID @createVariable |
    ID @createVariable COMA vars_aux2 |
    ID OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET @createVariableArray |
    ID OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET @createVariableArray COMA vars_aux2 |
    ID OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET @createVariableMatrix |
    ID OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET @createVariableMatrix COMA vars_aux2;

funcs: |
    function funcs;

main:
    VOID BAKY @createFunction OPEN_PARENTHESIS CLOSE_PARENTHESIS vars block @popScope;

type:
    INT {yy.quadruple.semantics.currentType = "INT";} |
    DOUBLE {yy.quadruple.semantics.currentType = "DOUBLE";} |
    CHAR {yy.quadruple.semantics.currentType = "CHAR";} |
    STRING {yy.quadruple.semantics.currentType = "STRING";} |
    BOOLEAN {yy.quadruple.semantics.currentType = "BOOLEAN";};

function:
    FUNCTION type ID @createFunction OPEN_PARENTHESIS params CLOSE_PARENTHESIS vars block @popScope |
    FUNCTION VOID ID @createFunction OPEN_PARENTHESIS params CLOSE_PARENTHESIS vars block @popScope;

block:
    OPEN_CURLY_BRACKET block_aux CLOSE_CURLY_BRACKET;

block_aux: |
    statute block_aux;

params: |
    params_aux;

params_aux:
    type ID @createVariable |
    type ID @createVariable COMA params_aux |
    type ID OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET @createVariableArrayParam |
    type ID OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET @createVariableArrayParam COMA params_aux |
    type ID OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET @createVariableMatrixParam |
    type ID OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET @createVariableMatrixParam COMA params_aux;

statute:
    call |
    return |
    read |
    write |
    if |
    assign |
    while |
    for;

call:
    ID OPEN_PARENTHESIS @validateFunction CLOSE_PARENTHESIS SEMICOLON |
    ID OPEN_PARENTHESIS @validateFunction call_aux CLOSE_PARENTHESIS SEMICOLON;

call_aux:
    exp |
    exp COMA call_aux;

return:
    RETURN exp SEMICOLON;

read:
    READ OPEN_PARENTHESIS read_aux CLOSE_PARENTHESIS SEMICOLON;

read_aux:
    var @processRead |
    var @processRead COMA read_aux;

write:
    WRITE OPEN_PARENTHESIS write_aux CLOSE_PARENTHESIS SEMICOLON;

write_aux:
    exp @processWrite |
    exp @processWrite COMA write_aux;

assign:
    var EQUAL @pushOperator exp SEMICOLON @processAssign;

if:
    IF OPEN_PARENTHESIS exp CLOSE_PARENTHESIS @processIf block @returnIf |
    IF OPEN_PARENTHESIS exp CLOSE_PARENTHESIS @processIf block ELSE @processElse block @returnIf;

while:
    WHILE @storeWhile OPEN_PARENTHESIS exp CLOSE_PARENTHESIS @processIf block @returnWhile;

for:
    FROM ID @validateForVariable TO exp @processFor DO block @endFor;

exp:
    superexp @processOperatorN5 |
    superexp @processOperatorN5 OR @pushOperator exp;

var:
    ID @validateVariable |
    ID OPEN_SQUARE_BRACKET exp CLOSE_SQUARE_BRACKET @validateArray |
    ID OPEN_SQUARE_BRACKET exp CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET exp CLOSE_SQUARE_BRACKET @validateMatrix;

superexp:
    megaexp @processOperatorN4 |
    megaexp @processOperatorN4 AND @pushOperator superexp;

megaexp:
    hiperexp @processOperatorN3 |
    hiperexp comp hiperexp @processOperatorN3;

hiperexp:
    term @processOperatorN2 |
    term @processOperatorN2 PLUS @pushOperator hiperexp |
    term @processOperatorN2 MINUS @pushOperator hiperexp;

comp:
    LESS_THAN @pushOperator |
    GREATER_THAN @pushOperator |
    EQ @pushOperator |
    NOT_EQUAL @pushOperator |
    GREATER_OR_EQ_THAN @pushOperator |
    LESS_OR_EQ_THAN @pushOperator;

term:
    factor @processOperatorN1 |
    factor @processOperatorN1 TIMES @pushOperator term |
    factor @processOperatorN1 DIVIDED @pushOperator term;

factor:
    OPEN_PARENTHESIS @pushBottom exp CLOSE_PARENTHESIS @popBottom |
    var |
    call |
    INT_VALUE {yy.quadruple.operands.push($1); yy.quadruple.types.push("INT");} |
    DOUBLE_VALUE {yy.quadruple.operands.push($1); yy.quadruple.types.push("DOUBLE");} |
    CHAR_VALUE {yy.quadruple.operands.push($1); yy.quadruple.types.push("CHAR");} |
    STRING_VALUE {yy.quadruple.operands.push($1); yy.quadruple.types.push("STRING");} |
    BOOLEAN_VALUE {yy.quadruple.operands.push($1); yy.quadruple.types.push("BOOLEAN");} ;