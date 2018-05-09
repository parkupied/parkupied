import React from 'react';
import {  Text, View } from 'react-native';
import { Button } from 'react-native-elements';

const Welcome = ({ navigation }) =>
(
        <View>
            <Text>Welcome to Parkupied. This is the first page</Text>
            <Text>You should login or sign up</Text>
            <Button title="Sign Up!" onPress={() => navigation.navigate('Signup')} />
            <Button title="Login!" onPress={() => navigation.navigate('Login')} />
        </View>
)

export default Welcome;
