import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Button, Text } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { signup } from '../fireMethods';
import firestore from '../firestore';
import firebase from 'firebase';
import style from '../public/style'

export default class Profile extends Component {
	state = {
		name: '',
    phone: '',
    carMake: '',
    carModel: '',
    carColor: '',
    license: '',
    id: ''
	};

  componentDidMount() {
    firestore.collection('users').where('email', '==', firebase.auth().currentUser.email).get()
    .then(users => {
      users.forEach(user => {
        this.setState({name: user.data().name, phone: user.data().phone, carMake: user.data().car.carMake, carModel: user.data().car.carModel, carColor: user.data().car.carColor, license: user.data().car.license, id: user.id})
      })
    })
  }

	handleSubmit = async () => {
		const name = this.state.name;
		const phone = this.state.phone;
		const carMake = this.state.carMake;
		const carModel = this.state.carModel;
		const carColor = this.state.carColor;
    const license = this.state.license;
    const id = this.state.id;

   await firestore.collection('users').doc(id).update({name: name, phone: phone, car: {carMake: carMake, carModel: carModel, carColor: carColor, license: license }});

    this.props.navigation.navigate('Menu');

	}


	render() {

		return (
			<View>
			<Button style={style.backButton} title='Go Back' onPress={() => this.props.navigation.navigate('Menu')} />
			<ScrollView style={style.button}>
				<FormLabel>Full Name</FormLabel>
				<FormInput value={this.state.name}
					onChangeText={name => this.setState({ name })}
				/>
				<FormLabel>Phone Number</FormLabel>
				<FormInput value={this.state.phone}
					onChangeText={phone => this.setState({ phone })}
				/>
				<FormLabel>Car Manufacturer</FormLabel>
				<FormInput value={this.state.carMake}
					onChangeText={carMake => this.setState({ carMake })}
				/>
				<FormLabel>Car Model</FormLabel>
				<FormInput value={this.state.carModel}
					onChangeText={carModel => this.setState({ carModel })}
				/>
				<FormLabel>Car Color</FormLabel>
				<FormInput value={this.state.carColor}
					onChangeText={carColor => this.setState({ carColor })}
				/>
				<FormLabel>License #</FormLabel>
        <FormInput value={this.state.license}
					onChangeText={license => this.setState({ license })}
				/>
				<View style={style.button}>
					<Button
						title="Save changes"
						onPress={this.handleSubmit}
					/>
				</View>
			</ScrollView>
			</View>
		);
	}
}
