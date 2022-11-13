import { StatusBar } from 'expo-status-bar';
import React from 'react';
import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
import { Text } from 'react-native';

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
  return(
    <SafeAreaView>
      <CodeEditor
            style={{
              ...{
                  fontSize: 26,
                  inputLineHeight: 26,
                  highlighterLineHeight: 26,
              },
              ...(keyboard.keyboardShown
                  ? { marginBottom: insets.bottom }
                  : {}),
          }}
            language="javascript"
            syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
            showLineNumbers
        />
    </SafeAreaView>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   input: {
//     height: 40,
//     margin: 12,
//     borderWidth: 1,
//     padding: 10,
//   },
// });
