%lex
%{
    if (!yy.isReady) {
        yy.isReady = true;
        yy.mylineno = 1;
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

baky:
    BAKY ID SEMICOLON vars funcs main;

vars: |
    vars_aux vars;

vars_aux: 
    VAR type vars_aux2 SEMICOLON;

vars_aux2:
    ID |
    ID COMA vars_aux2 |
    ID OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET |
    ID OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET COMA vars_aux2 |
    ID OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET |
    ID OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET INT_VALUE CLOSE_SQUARE_BRACKET COMA vars_aux2;

funcs: |
    function funcs;

main:
    BAKY OPEN_PARENTHESIS CLOSE_PARENTHESIS vars block;

type:
    INT |
    DOUBLE |
    CHAR |
    STRING |
    BOOLEAN;

function:
    FUNCTION type ID OPEN_PARENTHESIS params CLOSE_PARENTHESIS vars block |
    FUNCTION VOID ID OPEN_PARENTHESIS params CLOSE_PARENTHESIS vars block;

block:
    OPEN_CURLY_BRACKET block_aux CLOSE_CURLY_BRACKET;

block_aux: |
    statute block_aux;

params: |
    params_aux;

params_aux:
    type ID |
    type ID COMA params_aux |
    type ID OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET |
    type ID OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET COMA params_aux |
    type ID OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET |
    type ID OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET CLOSE_SQUARE_BRACKET COMA params_aux;

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
    ID OPEN_PARENTHESIS CLOSE_PARENTHESIS SEMICOLON |
    ID OPEN_PARENTHESIS call_aux CLOSE_PARENTHESIS SEMICOLON;

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
    FROM INT ID EQUAL exp TO exp DO block;

exp:
    superexp |
    superexp OR exp;

var:
    ID |
    ID OPEN_SQUARE_BRACKET exp CLOSE_SQUARE_BRACKET |
    ID OPEN_SQUARE_BRACKET exp CLOSE_SQUARE_BRACKET
        OPEN_SQUARE_BRACKET exp CLOSE_SQUARE_BRACKET;

superexp:
    megaexp |
    megaexp && superexp;

megaexp:
    hiperexp |
    hiperexp comp hiperexp;

hiperexp:
    term |
    term PLUS hiperexp |
    term MINUS hiperexp;

comp:
    LESS_THAN |
    GREATER_THAN |
    EQ |
    NOT_EQUAL |
    GREATER_OR_EQ_THAN |
    LESS_OR_EQ_THAN;

term:
    factor |
    factor TIMES term |
    factor DIVIDED term;

factor:
    OPEN_PARENTHESIS exp CLOSE_PARENTHESIS |
    var |
    call |
    INT_VALUE |
    DOUBLE_VALUE |
    CHAR_VALUE |
    STRING_VALUE |
    BOOLEAN_VALUE;