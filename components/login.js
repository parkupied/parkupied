import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

// import { Constants, Location, Permissions } from 'expo';

import firestore from '../firestore';
import firebase from 'firebase';


export default class Login extends Component {

	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit() {
		const email = this.state.email;
		const password = this.state.password;
		firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
			console.log(error);
		});

		console.log('hitting here');

		// firestore.collection('users').where("name", "==", name)
		// .get().then(snap => {
		// 	console.log(snap.forEach(doc => console.log(doc.data())))
		// 	// for (let key in snap) {
		// 	//     console.log(key)
		// 	// }
		// });

	}

	render() {

		return (
			<View style={styles.buttons}>
				<FormLabel>E-mail</FormLabel>
				<FormInput placeholder="Please enter your email"
					onChangeText={email => this.setState({ email })}
				/>
				<FormLabel>Password</FormLabel>
				<FormInput placeholder="Please enter your password"
					onChangeText={password => this.setState({ password })}
				/>
				<View style={styles.buttons}>
					<Button
						title="login"
						onPress={this.handleSubmit}
					>
						Login
					</Button>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttons: {
		// justifyContent: 'space-between',
		// flexDirection: 'row',
		margin: 20,
		marginTop: 50
	},
});
