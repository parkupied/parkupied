import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default class App extends React.Component {
	render() {
		return (
			<View style={styles.buttons}>
				<FontAwesome.Button
					name="facebook"
					backgroundColor="#3b5998"
					{...iconStyles}
				>
					Login with Facebook
				</FontAwesome.Button>
				<FontAwesome.Button
					name="google"
					backgroundColor="#DD4B39"
					{...iconStyles}
				>
					Or with Google
				</FontAwesome.Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: 'blue',
		fontSize: 35,
		borderColor: 'black',
	},
	buttons: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		margin: 20,
		marginTop: 'auto'
	},
});

const iconStyles = {
	borderRadius: 10,
	iconStyle: { paddingVertical: 5 },
};
