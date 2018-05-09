import React, { Component } from 'react';
import { StyleSheet, Text, Dimensions, View, Platform, Button } from 'react-native';
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
          <Button onPress={() => {}} title="Profile" />
          <Button onPress={() => {}} title="Donate" />
          <Button onPress={() => {}} title="Legal" />
          <Button onPress={() => {}} title="Settings" />
          <Button onPress={() => {}} title="Contact Us" />
          <Button onPress={() => {}} title="Watch the Fight" />
          <Button onPress={() => {}} title="Betting" />
          <Button onPress={() => {}} title="Help" />
          </View>
        }
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        ref={(ref) => this._drawer = ref}
        styles={drawerStyles}
      >
      <Map />
      <Button
        title="Open Drawer"
        onPress={this.openControlPanel}
      />
      </Drawer>
      )
  }
}

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    button: { padding: 20, marginTop: 150, backgroundColor: '#DDD' },
}
