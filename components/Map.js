import React, { Component } from 'react';
import { MapView, Constants, Location, Permissions } from 'expo';
import { StyleSheet, Text, Dimensions, View, Platform, Button } from 'react-native';
const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
import firestore from '../firestore';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Navbar from './navbar';


export default class Map extends Component {
  constructor() {
    super();
    this.state = {
      location: null,
      errorMessage: null,
      markers: [],
      userPos: {}
    }

  };

  componentDidMount() {
    this._getLocationAsync()
    firestore.collection('parkingSpots').get()
      .then(allSpots => {
        let tempMarkers = [];
        allSpots.forEach(spot => {
          const spotObj = spot.data().Coordinates;
          const latlng = { latitude: spotObj.latitude, longitude: spotObj.longitude };
          const objID = spot.id;

          let newMarker = {
            id: objID,
            latlng: latlng,
            title: 'some fake title....',
            description: 'some fake description....'
          }

          tempMarkers.push(newMarker);
        });

        this.setState({ markers: tempMarkers });
      })
  }

  handleLook = (event) => {
    console.log("Looking");
  }


  handleGive = (event) =>  {
    console.log("Giving");
    firestore.collection('parkingSpots')
      .add({ Coordinates: this.state.location.coords })
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



  onRegionChangeComplete = (location) => {
    // console.log('onRegionChangeComplete', location);
  };

  setRegion(location) {
    if (this.state.ready) {
      setTimeout(() => this.map.mapview.animateToRegion(location), 10);
    }
  }

  render() {
    const { location } = this.state;

    return (
      <View style={styles.container}>
        <Navbar navigation={this.props.navigation} />
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
          onRegionChangeComplete={this.onRegionChangeComplete}>

          {this.state.markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description} />
          ))}

        </MapView>
        {
          this.state.location &&
          <Text>{this.state.location.latitude}
            {this.state.location.longitude}
          </Text>
        }
        <Button
          title="Give up Parking!"
          onPress={this.handleGive}>
          Give up Parking!
        </Button>
        <Button
          title="Look For Parking!"
          onPress={this.handleLook}>
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
