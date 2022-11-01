const { Parser } = require("jison");
const path = require("path");
const { readFileSync } = require("fs");
const Quadruple = require('./quadruple.js');
const Semantics = require('./semantics.js');

const grammar = readFileSync(path.join(__dirname, "grammar.jison"), "utf-8");
const parser = new Parser(grammar, { debug: false });
const quadruple = new Quadruple();
const semantics = new Semantics();
parser.yy.data = {
    semantics
};
parser.parse(readFileSync('./test.txt', "utf-8"));