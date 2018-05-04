import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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


export default class App extends React.Component {


	componentDidMount() {
		firestore.collection('users').doc('L0WhdtLGqO8sv1IipMbn').get()
			.then(users => {
				console.log('USERSSS', users.data());
			})
		firestore.collection('users').doc('L0WhdtLGqO8sv1IipMbn').set({
			carInfo: { color: 'white'}
		})
	}

	render() {
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
