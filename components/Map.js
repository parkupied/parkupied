import React, { Component } from 'react';
import { MapView, Constants, Location, Permissions } from 'expo';
import { StyleSheet, Text, Dimensions, View, Platform, Button } from 'react-native';
const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
import firestore from '../firestore';


export default class Map extends Component {
constructor() {
  super();
  this.state = {
    location: null,
    errorMessage: null,
  };
  this.handleGive = this.handleGive.bind(this);
  this.handleLook = this.handleLook.bind(this);


}
componentWillMount() {
  this._getLocationAsync();
}

handleLook(event) {
  console.log("Looking");
}

handleGive(event) {
  console.log("Giving");
  firestore.collection('parkingSpots').add({
    Coordinates: this.state.location
  }
  );
}




  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location, ready: true });
	};

	getLocationAsync = async () => {
		const { Location, Permissions } = Expo;
		const { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status === 'granted') {
			return Location.getCurrentPositionAsync({enableHighAccuracy: true});
		} else {
			throw new Error('Location permission not granted');
		}
	}

  onRegionChangeComplete = (location) => {
    console.log('onRegionChangeComplete', location);
  };

  setRegion(location) {
    if (this.state.ready) {
      setTimeout(() => this.map.mapview.animateToRegion(location), 10);
    }
  }

	render() {

    // console.log("LOCATION", this.state.location);

    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    const { location } = this.state;



    return (
      <View style={styles.container}>
      <MapView
      style={styles.map}
      showsUserLocation={true}
      followsUserLocation={true}
        initialregion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={this.onRegionChangeComplete}
      />
      <Button
      title="Give up Parking!"
      onPress={this.handleGive}
      >
      Give up Parking!
      </Button>
      <Button
      title="Look For Parking!"
      onPress={this.handleLook}
      >
      Look for Parking!
      </Button>
        </View>
		);
	}
}


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollview: {
    alignItems: 'center',
  },
  map: {
    width: SCREEN_WIDTH,
    height: 500,
  },
});
