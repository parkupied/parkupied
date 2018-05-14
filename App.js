import { createStackNavigator } from 'react-navigation';
import Map from './components/Map';
import Signup from './components/Signup';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Menu from './components/Menu';


export default createStackNavigator({
	Welcome: { screen: Welcome },
	Login: { screen: Login },
	Signup: { screen: Signup },
	Map: { screen: Map },
	Menu: { screen: Menu }
}, {
		initialRouteName: 'Welcome',
		navigationOptions: {
			title: 'Parkupied',
			headerLeft: null,
			gesturesEnabled: false,
			header: null,
		}
	});

