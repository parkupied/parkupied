import React, { Component } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import firebase from 'firebase';


export default class Login extends Component {

	state = {
		email: '',
		password: '',
	};


	handleSubmit = () => {
		const email = this.state.email;
		const password = this.state.password;
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(() => {
				this.props.navigation.navigate('Menu');
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
		margin: 20,
		marginTop: 50
	},
});
