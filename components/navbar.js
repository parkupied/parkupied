import React, { Component } from 'react';
import {View, Button, StyleSheet} from 'react-native';
import firebase from 'firebase';


export default class Navbar extends Component {

  signOut = () => {
    firebase.auth().signOut()
    .catch(error => {
      console.log(error);
    });
    this.props.navigation.navigate('Welcome');
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

