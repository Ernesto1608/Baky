const { Parser } = require("jison");
const path = require("path");
const { readFileSync } = require("fs");

const grammar = readFileSync(path.join(__dirname, "grammar.jison"), "utf-8");
const parser = new Parser(grammar, { debug: true });
parser.parse(readFileSync('./test.txt', "utf-8"));