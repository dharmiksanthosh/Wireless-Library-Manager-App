import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class Header extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.textContainer}>
        <Text style={styles.text}>Willy App</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: '#fcae1e',
    borderWidth:10,
    borderColor:'#fa8128'
  },

  text: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
});