import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { Constants, Location, Permissions } from 'expo';
import { MapView } from 'expo';

import * as firebase from 'firebase';
import 'firebase/firestore';

var config = {
	apiKey: 'AIzaSyDEJFDnT7LQJE6K1zn3uw_eM2ELHS-n-Yk',
	authDomain: 'parkupied.firebaseapp.com',
	databaseURL: 'https://parkupied.firebaseio.com',
	projectId: 'parkupied',
	storageBucket: 'parkupied.appspot.com',
	messagingSenderId: '641475186680'
};

firebase.initializeApp(config);

const firestore = firebase.firestore();

const settings = {
	timestampsInSnapshots: true
};
firestore.settings(settings);



export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
	};

	componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
  
  	componentDidMount() {
		firestore.collection('users').doc('L0WhdtLGqO8sv1IipMbn').get()
			.then(users => {
				console.log('USERSSS', users.data());
			})
		firestore.collection('users').doc('L0WhdtLGqO8sv1IipMbn').set({
			carInfo: { color: 'white'}
		})
	}

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
	};

	getLocationAsync = async () => {
		const { Location, Permissions } = Expo;
		const { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status === 'granted') {
			return Location.getCurrentPositionAsync({enableHighAccuracy: true});
		} else {
			throw new Error('Location permission not granted');
		}
	}


	render() {
		let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
		}

		return (

			<View style={styles.buttons}>
				<FontAwesome.Button
					name="facebook"
					backgroundColor="#3b5998"
					{...iconStyles}
				>
					Login with Facebook
				</FontAwesome.Button>
				<FontAwesome.Button
					name="google"
					backgroundColor="#DD4B39"
					{...iconStyles}
				>
					Login with Google
				</FontAwesome.Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: 'blue',
		fontSize: 35,
		borderColor: 'black',
	},
	buttons: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		margin: 20,
		marginTop: 'auto'
	},
});

const iconStyles = {
	borderRadius: 10,
	iconStyle: { paddingVertical: 5 },
};
