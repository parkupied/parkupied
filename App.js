import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, YellowBox } from 'react-native';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';

import { Constants, Location, Permissions } from 'expo';
import { MapView } from 'expo';

import firestore from './firestore';
import Map from './components/Map';
import Signup from './components/signup';
import mainPage from './components/mainPage';
import Login from './components/login';
import welcome from './components/welcome';
import Navbar from './components/navbar';
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

// function resetNavigation(targetRoute) {
// 	const resetAction = NavigationActions.reset({
// 		index: 0,
// 		actions: [ NavigationActions.navigate({ routeName: targetRoute }) ]
// 	});
// 	this.props.navigation.dispatch(resetAction);
// }


export default createStackNavigator({
	welcome: {screen: welcome},
	login: {screen: Login},
	navbar: { screen: Navbar },
	signup: { screen: Signup },
	map: { screen: Map },
	main: { screen: mainPage },
	home: { screen: App },
}, 	{
	initialRouteName: 'welcome',
	navigationOptions: {
		title: 'map',
		headerLeft: null,
		gesturesEnabled: false,
	}
});
// this.resetNavigation('map')
