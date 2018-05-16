import React, { Component } from 'react';
import { StyleSheet, Text, Dimensions, View, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import Drawer from 'react-native-drawer';
import Map from './Map';
import firestore from '../firestore';
import { firebase } from '@firebase/app';
import style from '../public/style';


export default class Menu extends Component {
  state = {
    tokens : null
  }

  // componentDidMount() {
  //   firestore.collection('users').where('email', '==', firebase.auth().currentUser.email).get().then(allUsers => {
  //     allUsers.forEach(user => {
  //       this.setState({ tokens: user.data().tokens })
  //     })
  //   })
  //   console.log(firebase.auth().currentUser.email);
  // }

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
          <View style={style.menuButton}>
            <Text>Carma Points: {this.state.tokens}</Text>
            <Button
              buttonStyle={style.drawerButtonStyle}
              titleStyle={{ fontWeight: "700", position: "absolute" }}
              onPress={() => {this.props.navigation.navigate('Profile')}}
              title="Profile" />
            <Button
              buttonStyle={style.drawerButtonStyle}
              onPress={() => { }}
              title="Legal" />
            <Button
              buttonStyle={style.drawerButtonStyle}
              onPress={() => { }}
              title="Settings" />
            <Button
              buttonStyle={style.drawerButtonStyle}
              onPress={() => { }}
              title="Contact Us" />
            <Button
              buttonStyle={style.drawerButtonStyle}
              onPress={() => { }}
              title="Help" />
            <Button
              buttonStyle={style.drawerButtonStyle}
              onPress={() => { firebase.auth().signOut().then((() => this.props.navigation.navigate('Welcome'))) }}
              title="Logout" />
          </View>
        }
        openDrawerOffset={0.3}
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        ref={(ref) => this._drawer = ref}
        style={style.drawer}
      >
        <Map />

        <View style={style.callDrawerContainer}>
          <Button
            buttonStyle={style.menuButtonStyle}
            title="Menu"
            onPress={this.openControlPanel}
          />
        </View>
      </Drawer>
    )
  }
}
