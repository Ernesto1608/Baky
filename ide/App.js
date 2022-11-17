import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
//import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
import { Button, ScrollView, Text, TextInput, View } from 'react-native';
//import TextAreaWithLineNumber from 'text-area-with-line-number';
import { runCompiler } from './src';
//const { readFile } = require("react-native-fs");
//import nodejs from 'nodejs-mobile-react-native';
//import * as RNFS from 'react-native-fs';
//const baky = require("./baky");
// import { parser } from './metro.config';
// const Quadruple = require('./src/quadruple');
//const { Parser } = require('jison');

//import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <SafeAreaProvider>
        <CodeBlock/>
    </SafeAreaProvider>
  );
}

function CodeBlock() {
  const keyboard = useKeyboard();
  const insets = useSafeAreaInsets();

  const [height, setHeight] = useState(0);
  const [usedLines, setUsedLines] = useState(0);
  const [linesText, setLinesText] = useState("");

  const [code, setCode] = useState("");

  let webview;

  // useEffect( () => {
  //   nodejs.start('main.js');
  //   nodejs.channel.addListener(
  //     'message',
  //     (msg) => {
  //       alert('From node: ' + msg);
  //     },
  //     this 
  //   );
  // }, []);

  function _onLayout(e) {
    // the height increased therefore we also increase the usedLine counter
    if (height < e.nativeEvent.contentSize.height) {
        setUsedLines(usedLines+1);
        setLinesText(linesText+ (usedLines+1) + "\n");
    } 
    // the height decreased, we subtract a line from the line counter 
    if (height > e.nativeEvent.contentSize.height){
        setUsedLines(usedLines-1);
        const lineBreak = linesText.lastIndexOf('\n', linesText.length - 2);
        setLinesText(linesText.slice(0, lineBreak+1));
    }
    // update height if necessary
    if (height != e.nativeEvent.contentSize.height){
        setHeight(e.nativeEvent.contentSize.height);
    }
  }

  function run() {
    // const quadruple = new Quadruple();
    // parser.yy.data = {
    //     quadruple
    // };
    // parser.parse('fs.readFileSync(, "utf-8")');
    runCompiler(code);
  }

  const runFirst = `
      try{
        //import { runCompiler } from './src/index.js';

        var corescript = document.createElement('script');
        corescript.type = 'text/javascript';
        corescript.src = "./src/index.js";
        var parent = document.getElementsByTagName('head').item(0);
        parent.appendChild(corescript);
        void(0);


        

        console.log(document);
        //alert("sup");
        
        //runCompiler();
        console.log("hola");
      } catch(e) {
        alert(e);
      }
    `;

  const runBeforeFirst = `
      window.isNativeApp = true;
      true; // note: this is required, or you'll sometimes get silent failures

      console = new Object();
      console.log = function(log) {
        window.ReactNativeWebView.postMessage(log);
      };
      console.debug = console.log;
      console.info = console.log;
      console.warn = console.log;
      console.error = console.log;

  `;

  const customHTML = `
  <html>
    <head></head><body><script type="text/javascript" src="./src/index.js"></script></body>
  </html>
  `

  return(
    <SafeAreaView>
      {/* <WebView 
          ref={ref => (webview = ref)}
          source={{ html: customHTML }} 
          onMessage={(event) => { console.log(event) }}
          onLoad={() => {webview.injectJavaScript(runFirst)}}
          injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
        /> */}
      <View style={{height: '100%', display: 'flex', flexDirection: "column", backgroundColor: 'red'}}>
        <ScrollView style={{...{height: '100%', backgroundColor: 'blue', flexGrow: 1}, ...(keyboard.keyboardShown
                  ? { marginBottom: insets.bottom }
                  : {}),}} 
                  contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{flexGrow: 1, display: 'flex', flexDirection: "row", width: '100%'}}>
            <TextInput
              style={{backgroundColor: 'red', textAlignVertical: 'top', color: 'white', textAlignHorizontal: 'center'}}
              multiline
              editable={false}
              autoCapitalize='none'
              autoCorrect={false}
              value={linesText}
            />
            <TextInput
              style={{flexGrow: 1, backgroundColor: 'black', textAlignVertical: 'top', color: 'white'}}
              multiline
              autoCapitalize='none'
              autoCorrect={false}
              onContentSizeChange={(e)=> _onLayout(e)}
              value={code}
              onChangeText={(e) => setCode(e)}
            />
          </View>
        </ScrollView>
        <Button title='Run' onPress={() => {run()}}/>
      </View>
    </SafeAreaView>
  )
}