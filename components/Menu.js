import React, { Component } from 'react';
import { StyleSheet, Text, Dimensions, View, Platform } from 'react-native';
import { Button } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';

import Drawer from 'react-native-drawer';
import Map from './Map';

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
              title="Donate" />
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
              title="Watch the Fight" />
            <Button
              buttonStyle={drawerStyles.drawerButtonStyle}
              onPress={() => { }}
              title="Betting" />
            <Button
              buttonStyle={drawerStyles.drawerButtonStyle}
              onPress={() => { }}
              title="Help" />
          </View>
        }
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        ref={(ref) => this._drawer = ref}
        styles={drawerStyles}
      >
        <Map />
        <View style={drawerStyles.callDrawerContainer}>
          <Button
            buttonStyle={drawerStyles.drawerButtonStyle}
            title="Open Drawer"
            onPress={this.openControlPanel}
          />
        </View>
      </Drawer>
    )
  }
}

const drawerStyles = {
  drawer: {
    shadowColor: '#0000ff',
    shadowOpacity: 0.5,
    shadowRadius: 10
  },
  button: {
    padding: 5,
    // marginTop: 150,
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#aabbdd',
  },
  callDrawerContainer: {
    flex: 1,
  },
  drawerButtonStyle: {
    backgroundColor: "rgba(92, 99,216, 1)",
    width: 200,
    height: 45,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  }
}
