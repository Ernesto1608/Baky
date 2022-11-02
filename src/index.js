const { Parser } = require("jison");
const path = require("path");
const { readFileSync } = require("fs");
const Quadruple = require('./quadruple.js');

const grammar = readFileSync(path.join(__dirname, "grammar.jison"), "utf-8");
const parser = new Parser(grammar, { debug: false });
const quadruple = new Quadruple();
parser.yy.data = {
    quadruple
};
parser.parse(readFileSync('./test_2.txt', "utf-8"));