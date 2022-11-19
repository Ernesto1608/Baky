const { Parser } = require("jison");
const prompt = require('prompt');
const path = require("path");
const { readFileSync } = require("fs");
const Quadruple = require('./quadruple.js');
const VM = require('./vm.js');

const grammar = readFileSync(path.join(__dirname, "grammar.jison"), "utf-8");
const parser = new Parser(grammar, { debug: false });
const quadruple = new Quadruple();
parser.yy.data = {
    quadruple
};

prompt.start();

prompt.get(['filename'], function (err, result) {
    if (err) {
        return onErr(err);
    }
    parser.parse(readFileSync(result.filename, "utf-8"));
    const vm = new VM(quadruple);
    vm.run();
});

function onErr(err) {
    console.log(err);
    return 1;
}