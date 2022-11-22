// Archivo para el IDE donde se define toda el app

import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
import { Button, ScrollView, TextInput, View, Modal } from 'react-native';
import { runCompiler } from './src';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();
let resolver;

export default function App() {
  return (
    <SafeAreaProvider>
      <Navigation/>
    </SafeAreaProvider>
  );
}

function Navigation() {
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{flex: 1, paddingTop: insets.top}}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Code" children={() =>
            <CodeBlock logs={logs} setLogs={setLogs} setModalVisible={setModalVisible} />
          } />
          <Tab.Screen name="Console" children={() =>
            <Console logs={logs} setLogs={setLogs} modalVisible={modalVisible} setModalVisible={setModalVisible} />
          } />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

function CodeBlock({logs, setLogs, setModalVisible}) {
  const keyboard = useKeyboard();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [height, setHeight] = useState(0);
  const [usedLines, setUsedLines] = useState(0);
  const [linesText, setLinesText] = useState("");

  const [code, setCode] = useState("");

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

  function getInput() {
    setModalVisible(true);
    return new Promise((res) => {
      resolver = res;
    });
  }

  function addLog(log) {
    setLogs(logs => [...logs, log]);
  }

  function run() {
    try {
      runCompiler(code, addLog, getInput);
      navigation.navigate('Console');
    } catch (err) {
      addLog(err);
      navigation.navigate('Console');
    }
  }

  useEffect(() => {
    console.log(logs);
  }, [logs])


  return(
    <View style={{height: '100%', display: 'flex', flexDirection: "column"}}>
      <ScrollView style={{...{height: '100%', flexGrow: 1}, ...(keyboard.keyboardShown
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
  )
}

function Console({logs, setLogs, modalVisible, setModalVisible}) {
  const keyboard = useKeyboard();
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState("");

  return (
    <View style={{height: '100%', width: '100%', display: 'flex'}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{borderRadius: 10, padding: 35, backgroundColor: 'white'}}>
            <TextInput 
              placeholder='input' 
              multiline
              autoCapitalize='none'
              autoCorrect={false}
              value={input}
              onChangeText={(e) => setInput(e)}
              style={{borderWidth: 1, padding: 10, minHeight: 40, maxHeight: 250, width: 250, marginBottom: 20}}/>
            <Button title='Submit' onPress={() => {resolver(input); setModalVisible(false); setInput("");}}/>
          </View>
        </View>
      </Modal>
      <ScrollView style={{...{height: '100%', flexGrow: 1}, ...(keyboard.keyboardShown
                ? { marginBottom: insets.bottom }
                : {}),}} 
                contentContainerStyle={{ flexGrow: 1 }}>
        <TextInput
            style={{flexGrow: 1, backgroundColor: 'black', textAlignVertical: 'top', color: 'white'}}
            multiline
            editable={false}
            autoCapitalize='none'
            autoCorrect={false}
            value={logs.join('\n')}
          />
      </ScrollView>
      <Button title='Clear' onPress={() => {setLogs([])}}/>
    </View>
  )
}