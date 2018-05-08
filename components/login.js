import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, Button } from 'react-native';
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
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then( () => {
				this.props.navigation.navigate('map');
			})
			.catch(error => {
				console.log(error);
			})
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
