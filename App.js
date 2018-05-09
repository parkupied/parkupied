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

class App extends Component {
	render() {
		return (
			<View>

				<Text>Im here</Text>

			</View>
		)
	}
}

		//FUNCTION TO RESET THE STACKNAVIGATOR HISTORY. NOT BEING USED CURRENTLY
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

