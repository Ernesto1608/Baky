// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
// //const fs = require("react-native-fs");
// const { Parser } = require("jison");
// const path = require("path");
// import grammar from './src/grammar';

module.exports = getDefaultConfig(__dirname);

// const parser = new Parser(grammar, { debug: false });
// parser.yy.data = {
//     quadruple
// };
// console.log("hola")
// config.parser = parser;

// console.log(parser.parse("adfe34bc e82a"));
// console.log(parser.parse("adfe34bc zxg"));

// module.exports = config;