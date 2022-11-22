// Codigo comentado para pasar de grammar.jison a un json

// const path = require("path");
// const fs = require("fs");
// var jison2json = require('jison2json');

// function convertJison() {
//     const grammar = fs.readFileSync(path.join(__dirname, "grammar.jison"), "utf-8");
//     fs.writeFile('./grammarConverted.txt', jison2json.convert(grammar), err => {
//         if (err) {
//           console.error(err);
//         }
//         // file written successfully
//       });
// }

// convertJison();

// module.exports = { convertJison };


// Este es el archivo principal, donde recibe el codigo
// y hace la compilacion y ejecucion del mismo

const { Parser } = require("jison");
const Quadruple = require('./quadruple.js');
const VM = require('./vm.js');
const grammar = require('./grammar');

function runCompiler(code, addLog, getInput) {
    if(code) {
        const parser = new Parser(grammar, { debug: false });
        const quadruple = new Quadruple();
        parser.yy.data = {
            quadruple
        };
        parser.parse(code);
        
        const vm = new VM(quadruple, addLog, getInput);
        vm.run();
    }
}

runCompiler();

module.exports = { runCompiler };