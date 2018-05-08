import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Button } from 'react-native-elements';

export default Welcome = ({ navigation }) => {

    return (
        <View>
            <Text>Welcome to Parkupied. This is the first page</Text>
            <Text>You should login or sign up</Text>
            <Button title="Sign Up!" onPress={() => navigation.navigate("signup")} />
            <Button title="Login!" onPress={() => navigation.navigate("login")} />
        </View>
    );
}
