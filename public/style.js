var React = require('react-native');


var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({

	button: {
		margin: 20,
		marginTop: 50
  },
  backButton: {
		marginTop: 'auto'
  },
  drawer: {
    backgroundColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 10
  },

  menuButton: {
    padding: 1,
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  callDrawerContainer: {
    padding: 25
  },

  drawerButtonStyle: {
    backgroundColor: "#C0C0C0",
    width: 200,
    height: 45,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5
  },
  menuButtonStyle: {
    backgroundColor: "rgba(48,48,48,1)",
    width: 100,
    height: 45,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5
  },
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
welcomeButton: {
    width: 150,
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
    color: 'white'
},
logo: {
    width: 400,
    height: 300,
    margin: 50,
}
  });
