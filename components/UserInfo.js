import React, { Component } from 'react';
import { Modal, View, Button, Text } from 'react-native';
import firestore from '../firestore';
import style from '../public/style';

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
                animationType="slide"
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
                        height: 600,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                    }}>
                        <Text style={{fontSize: 32, color: 'white', fontWeight: 'bold', textAlign: 'center' }} >You got a match!</Text>
                        <Text>You've matched with {this.state && this.state.name}</Text>
                        <Text>Phone: {this.state && this.state.phone}</Text>
                        <Text>Car: {this.state && this.state.carMake}</Text>
                        <Text>Color: {this.state && this.state.carColor}</Text>
                        <Text>Model: {this.state && this.state.carModel}</Text>
                        <Text>License: {this.state && this.state.license}</Text>
                        <Button style={style.button} title="Close me!" onPress={() => this.setState({ isOpen: false })} />
                    </View>
                </View>
            </Modal>
        );
    }
}
