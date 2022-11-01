%lex
%{
    if (!yy.isReady) {
        yy.isReady = true;
        yy.mylineno = 1;
        const { semantics, quadruple } = yy.data;
        yy.semantics = semantics;
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
    yy.semantics.globalName = $1;
    yy.semantics.createFunction($1, yy.mylineno);
};

@createFunction: {
    if($0 == "void") yy.semantics.currentType = "VOID";
    yy.semantics.createFunction($1, yy.mylineno);
};

@validateFunction: {
    yy.semantics.validateFunction($0, yy.mylineno);
};

@popScope: {
    let currentScope = yy.semantics.scopeStack.pop();
    // yy.semantics.functionsTable[currentScope].variablesTable = {};
};

@createVariable: {
    yy.semantics.createVariable($1, yy.mylineno);
};

@createVariableArray: {
    yy.semantics.createVariableArray($-2, yy.mylineno, "ARRAY", [$0]);
};

@createVariableArrayParam: {
    yy.semantics.createVariableArray($-1, yy.mylineno, "ARRAY", []);
};

@createVariableMatrix: {
    yy.semantics.createVariableArray($-5, yy.mylineno, "MATRIX", [$-3, $0]);
};

@createVariableMatrixParam: {
    yy.semantics.createVariableArray($-3, yy.mylineno, "MATRIX", []);
};

@validateVariable: {
    yy.semantics.validateVariable($1, yy.mylineno, "");
};

@validateArray: {
    yy.semantics.validateVariable($-2, yy.mylineno, "ARRAY");
};

@validateMatrix: {
    yy.semantics.validateVariable($-5, yy.mylineno, "MATRIX");
};

baky:
    BAKY ID @createProgram SEMICOLON vars funcs main {
        // yy.semantics.functionsTable = {};
        console.log(JSON.stringify(yy.semantics.functionsTable, null, 4));
        console.log(`Successful compilation of program ${yy.semantics.globalName}`);
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
    INT {yy.semantics.currentType = "INT";} |
    DOUBLE {yy.semantics.currentType = "DOUBLE";} |
    CHAR {yy.semantics.currentType = "CHAR";} |
    STRING {yy.semantics.currentType = "STRING";} |
    BOOLEAN {yy.semantics.currentType = "BOOLEAN";};

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
    var |
    var COMA read_aux;

write:
    WRITE OPEN_PARENTHESIS write_aux CLOSE_PARENTHESIS SEMICOLON;

write_aux:
    STRING_VALUE |
    STRING_VALUE COMA write_aux |
    exp |
    exp COMA write_aux;

assign:
    var EQUAL exp SEMICOLON;

if:
    IF OPEN_PARENTHESIS exp CLOSE_PARENTHESIS block |
    IF OPEN_PARENTHESIS exp CLOSE_PARENTHESIS block ELSE block;

while:
    WHILE OPEN_PARENTHESIS exp CLOSE_PARENTHESIS block;

for:
    FROM ID @validateVariable TO exp DO block;

exp:
    superexp |
    superexp OR exp;

var:
    ID @validateVariable |
    ID OPEN_SQUARE_BRACKET exp CLOSE_SQUARE_BRACKET @validateArray |
    ID OPEN_SQUARE_BRACKET exp CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET exp CLOSE_SQUARE_BRACKET @validateMatrix;

superexp:
    megaexp |
    megaexp AND superexp;

megaexp:
    hiperexp |
    hiperexp comp hiperexp;

hiperexp:
    term |
    hiperexp PLUS term |
    hiperexp MINUS term;

comp:
    LESS_THAN |
    GREATER_THAN |
    EQ |
    NOT_EQUAL |
    GREATER_OR_EQ_THAN |
    LESS_OR_EQ_THAN;

term:
    factor |
    term TIMES factor |
    term DIVIDED factor;

factor:
    OPEN_PARENTHESIS exp CLOSE_PARENTHESIS |
    var |
    call |
    INT_VALUE |
    DOUBLE_VALUE |
    CHAR_VALUE |
    STRING_VALUE |
    BOOLEAN_VALUE;