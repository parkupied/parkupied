import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';

const styles = StyleSheet.create({
    container: {
        padding: 50,
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    containerRow: {
        flex: 1,
        backgroundColor: '#aabbff',
        width: 400,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    signUp: {
        width: 150,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        padding: 2,
    },
    tittle: {
        width: 500,
        backgroundColor: '#aabbff',
        fontFamily: 'Cochin',
        fontWeight: 'bold',
        fontSize: 31,
        textAlign: 'center',
        color: '#2B60DE'
    },
    logo: {
        width: 400,
        height: 300,
        margin: 50,
    },
});

const Welcome = ({ navigation }) => (
    <View style={styles.container}>
        <Text style={styles.tittle}>Welcome to Parkupied!</Text>
        <Image style={styles.logo}
            source={require('../logo.jpg')}
        />
        <View style={styles.containerRow}>
            <Button style={styles.signUp} title="Sign Up!" onPress={() => navigation.navigate('Signup')} />
            <Button style={styles.signUp} title="Login!" onPress={() => navigation.navigate('Login')} />
        </View>
    </View>
)

export default Welcome;
