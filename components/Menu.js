import React, { Component } from 'react';
import { StyleSheet, Text, Dimensions, View, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import Drawer from 'react-native-drawer';
import Map from './Map';
import { firebase } from '@firebase/app';

export default class Menu extends Component {

  closeControlPanel = () => {
    this._drawer.close();
  }

  openControlPanel = () => {
    this._drawer.open();
  }

  render() {
    return (
      <Drawer
        type="overlay"
        tapToClose={true}
        content={
          <View style={drawerStyles.button}>
            <Button
              buttonStyle={drawerStyles.drawerButtonStyle}
              onPress={() => { }}
              title="Profile" />
            <Button
              buttonStyle={drawerStyles.drawerButtonStyle}
              onPress={() => { }}
              title="Legal" />
            <Button
              buttonStyle={drawerStyles.drawerButtonStyle}
              onPress={() => { }}
              title="Settings" />
            <Button
              buttonStyle={drawerStyles.drawerButtonStyle}
              onPress={() => { }}
              title="Contact Us" />
            <Button
              buttonStyle={drawerStyles.drawerButtonStyle}
              onPress={() => { }}
              title="Help" />
            <Button
              buttonStyle={drawerStyles.drawerButtonStyle}
              onPress={() => { firebase.auth().signOut().then((() => this.props.navigation.navigate('Welcome'))) }}
              title="Logout" />
          </View>
        }
        openDrawerOffset={0.3}
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        ref={(ref) => this._drawer = ref}
        style={drawerStyles.drawer}
      >
        <Map />

        <View style={drawerStyles.callDrawerContainer}>
          <Button
            buttonStyle={drawerStyles.menuButtonStyle}
            title="Menu"
            onPress={this.openControlPanel}
          />
        </View>
      </Drawer>
    )
  }
}

const drawerStyles = {

  drawer: {
    backgroundColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },

  button: {
    padding: 1,
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  callDrawerContainer: {
    padding: 25
  },

  drawerButtonStyle: {
    backgroundColor: "#C0C0C0",
    width: 150,
    height: 45,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5
  },
  menuButtonStyle: {
    backgroundColor: "rgba(48,48,48,1)",
    width: 100,
    height: 45,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5
  }
}
