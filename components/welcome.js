import React from 'react';
import {  Text, View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';

const styles = StyleSheet.create({
    signUp: {
        marginTop: 100,
        height: 70,
        backgroundColor: '#2B60DE'

    },
    tittle: {
        fontWeight: '900',
        fontSize: 31,
        textAlign: 'center',
        marginTop: 50,
        color: '#2B60DE'
    },
    logo: {
        width: 415,
        height: 300,
        marginTop: 100
    },
});


const Welcome = ({ navigation }) =>
(

            <View>
                    <Text style={styles.tittle}>Welcome to Parkupied!</Text>
                    <Image
                    style={styles.logo}
                    source={require('../logo.jpg')} />
                <Button style={styles.signUp} title="Sign Up!" onPress={() => navigation.navigate('Signup')} />
                <Button style={styles.logIn} title="Login!" onPress={() => navigation.navigate('Login')} />
            </View>

)

export default Welcome;
