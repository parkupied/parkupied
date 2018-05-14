import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';

const styles = StyleSheet.create({
    container: {
        padding: 50,
        flex: 1,
        backgroundColor: '#969694',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    containerRow: {
        flex: 1,
        backgroundColor: '#969694',
        width: 400,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        width: 400,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        padding: 2,
    },
    signUp: {
        width: 150,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        padding: 2,
    },
    title: {
        fontSize: 75,
        fontWeight: 'bold',
        width: 500,
        backgroundColor: '#969694',
        textAlign: 'center',
    },
    logo: {
        width: 400,
        height: 300,
        margin: 50,
    },
});

const Welcome = ({ navigation }) => (
    <View style={styles.container}>
        <Text style={styles.title}>ParkuPied</Text>
        <Image style={styles.logo}
            source={require('../logo.png')}
        />
        <View style={styles.containerRow}>
            <Button style={styles.button} title="Sign Up" onPress={() => navigation.navigate('Signup')} />
            <Button style={styles.button} title="Login" onPress={() => navigation.navigate('Login')} />
        </View>
    </View>
)

export default Welcome;
