// const { Parser } = require("jison");
// const path = require("path");
// const fs = require("fs");
// const Quadruple = require('./quadruple.js');
// const VM = require('./vm.js');
// var jison2json = require('jison2json');

// console.log("hola");



// function runCompiler() {
//     const grammar = fs.readFileSync(path.join(__dirname, "grammar.jison"), "utf-8");
//     fs.writeFile('./test.txt', jison2json.convert(grammar), err => {
//         if (err) {
//           console.error(err);
//         }
//         // file written successfully
//       });
//     const parser = new Parser(grammar, { debug: false });
//     const quadruple = new Quadruple();
//     parser.yy.data = {
//         quadruple
//     };
//     // parser.parse(fs.readFileSync('./test_4.txt', "utf-8"));
//     // const vm = new VM(quadruple);
//     // vm.run();
// }

// runCompiler();

// module.exports = { runCompiler, fs };

const { Parser } = require("jison");
const path = require("path");
const Quadruple = require('./quadruple.js');
const VM = require('./vm.js');
const grammar = require('./grammar');

function runCompiler(code) {
    if(code) {
        const parser = new Parser(grammar, { debug: false });
        const quadruple = new Quadruple();
        parser.yy.data = {
            quadruple
        };
        console.log(code);
        parser.parse(code);
        
        const vm = new VM(quadruple);
        vm.run();
    }
}

runCompiler();

module.exports = { runCompiler };