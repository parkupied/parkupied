import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

// import { Constants, Location, Permissions } from 'expo';

import firestore from '../firestore';


export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            license: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        console.log("ANYTHING");
        console.log(this.state);
        const name = this.state.name;
        const email = this.state.email;
        const license = this.state.license;

        firestore.collection('users').where("name", "==", name)
        .get().then(snap => {
            console.log(snap.forEach(doc => console.log(doc.data())))
            // for (let key in snap) {
            //     console.log(key)
            // }
        });

    }

	render() {

		return (
            <View style={styles.buttons}>
                <FormLabel>Full Name</FormLabel>
                <FormInput placeholder="Please enter your full name" 
                    onChangeText={name => this.setState({ name })}
                />
                <FormLabel>E-mail</FormLabel>
                <FormInput placeholder="Please enter your email" 
                    onChangeText={email => this.setState({ email })}
                />
                <FormLabel>License #</FormLabel>
                <FormInput placeholder="Please enter your license #" 
                    onChangeText={license => this.setState({ license })}
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

const iconStyles = {
	borderRadius: 10,
	iconStyle: { paddingVertical: 5 },
};