import React, { Component } from 'react';
import {Header} from 'react-native-elements';
import {View, Text, Button, StyleSheet} from 'react-native';
import firebase from 'firebase';


export default class Navbar extends Component {

  signOut = () => {
    firebase.auth().signOut().then(() => {
      console.log('you are logged out');
    })
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <View style={styles.button}>
      <Button onPress={this.signOut} title='LogOut'>Log Out </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',

  }
})

