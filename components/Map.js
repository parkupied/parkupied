import React, { Component } from 'react';
import { MapView, Constants, Location, Permissions } from 'expo';
import { StyleSheet, Text, View, Platform } from 'react-native';


export default class Map extends Component {

  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
      this._getLocationAsync();
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
      <MapView
      showsUserLocation={true}
      followsUserLocation={true}
        style={{ flex: 1 }}
        initialregion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={this.onRegionChangeComplete}
      />
		);
	}
}
