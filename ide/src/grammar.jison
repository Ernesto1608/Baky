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

\/\/(.*) ;

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
"==" { return "EQ"; }
"=" { return "EQUAL"; }
"||" { return "OR"; }
"&&" { return "AND"; }
"*" { return "TIMES"; }
"/" { return "DIVIDED"; }
"!=" { return "NOT_EQUAL"; }
"<=" { return "LESS_OR_EQ_THAN"; }
">=" { return "GREATER_OR_EQ_THAN"; }
"<" { return "LESS_THAN"; }
">" { return "GREATER_THAN"; }

(true|false) { return "BOOLEAN_VALUE"; }
"+" { return "PLUS"; }
"-" { return "MINUS"; }
[0-9]+\.[0-9]+ { return "DOUBLE_VALUE"; }
[0-9]+ { return "INT_VALUE"; }
\"[^\"]*\" { return "STRING_VALUE"; }
\'.\' { return "CHAR_VALUE"; }
[a-zA-z]\w* { return "ID"; }
\n {yy.mylineno++;}
(\t|\s) {}
. {throw new Error("Unsupported symbols on line " + yy.mylineno); }

/lex

%left PLUS MINUS
%left TIMES DIVIDED
%left UMINUS

%start baky

%%

//Neuralgic points definition 
@createProgram: {
    yy.quadruple.semantics.globalName = $1;
    yy.quadruple.semantics.createFunction($1, yy.mylineno, 0);
};

@fillGlobalMemory: {
    const resources = yy.quadruple.semantics.functionsTable[$-2].resources;
    yy.quadruple.semantics.memory.fillGlobalMemory(resources);
};

@createFunction: {
    if($0 == "void") yy.quadruple.semantics.currentType = "VOID";
    const quadLength = yy.quadruple.quadruples.length;
    yy.quadruple.semantics.createFunction($1, yy.mylineno, quadLength);
};

@validateFunction: {
    yy.quadruple.semantics.validateFunction($0, yy.mylineno);
};

@validateParams: {
    yy.quadruple.semantics.validateParams(yy.mylineno);
    yy.quadruple.createFunctionJump();
};

@createParam: {
    yy.quadruple.createParam(yy.mylineno);
};

@popScope: {
    let currentScope = yy.quadruple.semantics.scopeStack.pop();
    if(currentScope != "Baky") {
        yy.quadruple.returnFromFunction(currentScope);
    }
    yy.quadruple.semantics.functionsTable[currentScope].variablesTable = {};
};

@returnError: {
    let currentScopeF = yy.quadruple.semantics.scopeStack.peek();
    yy.quadruple.quadruples.push(["returnError", currentScopeF, null, null]);
};

@createVariable: {
    yy.quadruple.semantics.createVariable($1, yy.mylineno);
};

@createParameter: {
    yy.quadruple.semantics.createParameter($1, yy.mylineno);
};

@createVariableArray: {
    yy.quadruple.semantics.createVariableArray($-2, yy.mylineno, "ARRAY", [$0]);
};

@createVariableMatrix: {
    yy.quadruple.semantics.createVariableArray($-5, yy.mylineno, "MATRIX", [$-3, $0]);
};

@processFor: {
    yy.quadruple.processFor(yy.mylineno);
};

@endFor: {
    yy.quadruple.endFor();
};

@validateVariable: {
    let typeV = yy.quadruple.semantics.validateVariable($1, yy.mylineno, "");
    yy.quadruple.operands.push(typeV.address);
    yy.quadruple.types.push(typeV.type);
};

@validateArray: {
    let typeA = yy.quadruple.semantics.validateVariable($-4, yy.mylineno, "ARRAY");
    let addArray = yy.quadruple.processArray(typeA, yy.mylineno);
    yy.quadruple.operands.push(addArray);
    yy.quadruple.types.push(typeA.type);
};

@validateMatrix: {
    let typeM = yy.quadruple.semantics.validateVariable($-9, yy.mylineno, "MATRIX");
    let addMatrix = yy.quadruple.processMatrix(typeM);
    yy.quadruple.operands.push(addMatrix);
    yy.quadruple.types.push(typeM.type);
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
    yy.quadruple.processWrite(yy.mylineno);
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

@handleReturn: {
    yy.quadruple.handleReturn(yy.mylineno);
};

baky:
    BAKY ID @createProgram SEMICOLON vars @fillGlobalMemory funcs main {
        // for(let i = 0; i < yy.quadruple.quadruples.length; i++) {
        //     console.log(i + " : " + yy.quadruple.quadruples[i]);
        // }
        // console.log(JSON.stringify(yy.quadruple.semantics.functionsTable, null, 4));
        // console.log(yy.quadruple.semantics.memory.virtualMemory);
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
    FUNCTION type ID @createFunction OPEN_PARENTHESIS params CLOSE_PARENTHESIS vars block @returnError @popScope |
    FUNCTION VOID ID @createFunction OPEN_PARENTHESIS params CLOSE_PARENTHESIS vars block @popScope;

block:
    OPEN_CURLY_BRACKET block_aux CLOSE_CURLY_BRACKET;

block_aux: |
    statute block_aux;

params: |
    params_aux;

params_aux:
    type ID @createParameter |
    type ID @createParameter COMA params_aux;

statute:
    call SEMICOLON |
    return |
    read |
    write |
    if |
    assign |
    while |
    for;

call:
    ID OPEN_PARENTHESIS @validateFunction @pushBottom CLOSE_PARENTHESIS @popBottom @validateParams |
    ID OPEN_PARENTHESIS @validateFunction @pushBottom call_aux CLOSE_PARENTHESIS @popBottom @validateParams;

call_aux:
    exp @createParam |
    exp @createParam COMA call_aux;

return:
    RETURN exp @handleReturn SEMICOLON;

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
    var EQUAL @pushOperator exp @processAssign SEMICOLON;

if:
    IF OPEN_PARENTHESIS exp CLOSE_PARENTHESIS @processIf block @returnIf |
    IF OPEN_PARENTHESIS exp CLOSE_PARENTHESIS @processIf block ELSE @processElse block @returnIf;

while:
    WHILE @storeWhile OPEN_PARENTHESIS exp CLOSE_PARENTHESIS @processIf block @returnWhile;

for:
    FROM var TO exp @processFor DO block @endFor;

exp:
    superexp @processOperatorN5 |
    superexp @processOperatorN5 OR @pushOperator exp;

var:
    ID @validateVariable |
    ID OPEN_SQUARE_BRACKET @pushBottom exp CLOSE_SQUARE_BRACKET @popBottom @validateArray |
    ID OPEN_SQUARE_BRACKET @pushBottom exp CLOSE_SQUARE_BRACKET @popBottom
        OPEN_SQUARE_BRACKET @pushBottom exp CLOSE_SQUARE_BRACKET @popBottom @validateMatrix;

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
    INT_VALUE {yy.quadruple.processConstant(parseInt($1),"INT");} |
    MINUS INT_VALUE %prec UMINUS {yy.quadruple.processConstant(parseInt($2)*-1,"INT");} |
    DOUBLE_VALUE {yy.quadruple.processConstant(parseFloat($1),"DOUBLE");} |
    MINUS DOUBLE_VALUE {yy.quadruple.processConstant(parseInt($2)*-1,"DOUBLE");} |
    CHAR_VALUE {yy.quadruple.processConstant($1.charAt(1),"CHAR");} |
    STRING_VALUE {yy.quadruple.processConstant($1.slice(1,-1),"STRING");} |
    BOOLEAN_VALUE {yy.quadruple.processConstant($1 == "true" ?  true :  false,"BOOLEAN");} ;