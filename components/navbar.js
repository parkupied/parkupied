import React, { Component } from 'react';
import {Header} from 'react-native-elements';
import {View, Text, Button, StyleSheet} from 'react-native';
import firebase, { firestore } from 'firebase';


export default class Navbar extends Component {

  constructor() {
    super()
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    firebase.auth().signOut()
    .catch(error => {
      console.log(error);
    });
    this.props.navigation.navigate('welcome');
  }

  render() {
    return (
      <View style={styles.button}>
      <Button onPress={this.signOut} title="Log Out" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',

  }
})

