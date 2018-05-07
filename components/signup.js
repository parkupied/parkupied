import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

// import { Constants, Location, Permissions } from 'expo';

import firestore from '../firestore';


export default class Signup extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            phone: '',
            email: '',
            carMake: '',
            carModel: '',
            carColor: '',
            license: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        console.log("ANYTHING");
        console.log(this.state);
        const name = this.state.name;
        const phone = this.state.phone;
        const email = this.state.email;
        const carMake = this.state.carMake;
        const carModel = this.state.carModel;
        const carColor = this.state.carColor;
        const license = this.state.license;

        firestore.collection('users').add({
            name,
            phone,
            email,
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

    }

	render() {

		return (
            <View style={styles.buttons}>
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
                        title="signup"
                        onPress={this.handleSubmit}
                    >
                        Signup
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

const iconStyles = {
	borderRadius: 10,
	iconStyle: { paddingVertical: 5 },
};