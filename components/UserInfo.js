import React, { Component } from 'react';
import { Modal, View, Button, Text } from 'react-native';
import firestore from '../firestore';

export default class UserInfo extends Component {

    constructor () {
        super();
        state = {
            name: '',
            phone: '',
            carMake: '',
            carModel: '',
            carColor: '',
            license: '',
            isOpen: true
        };
    }

    async componentDidMount () {
        await firestore.collection("users").where("email", "==", this.props.email).get()
        .then( allUsers => {
            allUsers.forEach( singleUser => {
                this.setState({
                    name: singleUser.data().name,
                    phone: singleUser.data().phone,
                    carMake: singleUser.data().car.carMake,
                    carModel: singleUser.data().car.carModel,
                    carColor: singleUser.data().car.carColor,
                    license: singleUser.data().car.license,
                })
            })
        }) 
    }

    render () {
        return (
            <Modal
                transparent={true}
                visible={this.state && this.state.isOpen}
                onRequestClose={() => {this.setState({ isOpen: false })}}
            >
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 300,
                        height: 300,
                        backgroundColor: "red"
                    }}>
                        <Text>You got a match!!</Text>
                        <Text>Name: {this.state && this.state.name}</Text>
                        <Text>Phone: {this.state && this.state.phone}</Text>
                        <Text>Car: {this.state && this.state.carMake}</Text>
                        <Text>Color: {this.state && this.state.carColor}</Text>
                        <Text>Model: {this.state && this.state.carModel}</Text>
                        <Text>License: {this.state && this.state.license}</Text>
                        <Text>This the text in the modal.</Text>
                        <Button title="Close me!" onPress={() => this.setState({ isOpen: false })} />
                    </View>
                </View>
            </Modal>
        );
    }
}