import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Button } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import firestore from '../firestore';
import firebase from 'firebase';

export default class Signup extends Component {
	state = {
		name: '',
		phone: '',
		email: '',
		password: '',
		carMake: '',
		carModel: '',
		carColor: '',
		license: '',
	};

	handleSubmit = async () => {
		const name = this.state.name;
		const phone = this.state.phone;
		const email = this.state.email;
		const password = this.state.password;
		const carMake = this.state.carMake;
		const carModel = this.state.carModel;
		const carColor = this.state.carColor;
		const license = this.state.license;


		await firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
			console.log(error);
		});

		//Try - Catch

		await firestore.collection('users').add({
			name,
			phone,
			email,
			password,
			car: {
				carMake,
				carModel,
				carColor,
				license,
			},
			tokens: 0,
			rating: 0,
			stikes: 0,
			location: [],
			matches: {},
			pastMatches: []
		});
		await this.props.navigation.navigate('Menu');
	}


	render() {

		return (
			<View>
			<Button style={styles.backButton} title='Go Back' onPress={() => this.props.navigation.navigate('Welcome')} />
			<ScrollView style={styles.buttons}>
				<FormLabel>Full Name</FormLabel>
				<FormInput placeholder="Please enter your full name"
					onChangeText={name => this.setState({ name })}
				/>
				<FormLabel>Phone Number</FormLabel>
				<FormInput placeholder="Please enter your phone number"
					onChangeText={phone => this.setState({ phone })}
				/>
				<FormLabel>E-mail</FormLabel>
				<FormInput placeholder="Please enter your email"
					onChangeText={email => this.setState({ email })}
				/>
				<FormLabel>Password</FormLabel>
				<FormInput placeholder="Please enter your password"
					onChangeText={password => this.setState({ password })}
				/>
				<FormLabel>Car Manufacturer</FormLabel>
				<FormInput placeholder="Please enter your car make"
					onChangeText={carMake => this.setState({ carMake })}
				/>
				<FormLabel>Car Model</FormLabel>
				<FormInput placeholder="Please enter your car model"
					onChangeText={carModel => this.setState({ carModel })}
				/>
				<FormLabel>Car Color</FormLabel>
				<FormInput placeholder="Please enter your car color"
					onChangeText={carColor => this.setState({ carColor })}
				/>
				<FormLabel>License #</FormLabel>
				<FormInput placeholder="Please enter your license #"
					onChangeText={license => this.setState({ license })}
				/>
				<View style={styles.buttons}>
					<Button
						title="Signup"
						onPress={this.handleSubmit}
					/>
				</View>
			</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttons: {
		margin: 20,
		marginTop: 50
	},
	backButton: {
		marginTop: 'auto'
	}
});

