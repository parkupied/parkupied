import { createStackNavigator } from 'react-navigation';
import Map from './components/Map';
import Signup from './components/Signup';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Navbar from './components/Navbar';

export default createStackNavigator({
	Welcome: { screen: Welcome },
	Login: { screen: Login },
	Navbar: { screen: Navbar },
	Signup: { screen: Signup },
	Map: { screen: Map }
}, {
		initialRouteName: 'Welcome',
		navigationOptions: {
			title: 'Map',
			headerLeft: null,
			gesturesEnabled: false,
		}
	});

