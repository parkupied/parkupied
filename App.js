// OB/DS: lots of unused dependencies right now
import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, YellowBox } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';

import { Constants, Location, Permissions } from 'expo';
import { MapView } from 'expo';

import firestore from './firestore';
import Map from './components/Map';
import Signup from './components/signup';
import mainPage from './components/mainPage';
import Welcome from './components/welcome';
import Login from './components/login';
// OB/DS: commented out code should not be in master
// YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated in plain JavaScript React classes. Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks.', 'Module RCTImageLoader']);

class App extends Component {
	render() {
		return (
			<View>

				<Text>Im here</Text>

			</View>
		)
	}
}

// OB/DS: look into (stack) navigator options / configurations
export default createStackNavigator({

	signup: { screen: Signup },
	map: { screen: Map },
	main: { screen: mainPage },
	home: { screen: App },
}, 	{
	initialRouteName: 'signup',

});
