import React, { Component } from 'react';
import { MapView, Constants, Location, Permissions } from 'expo';
import { StyleSheet, Text, Dimensions, View, Platform, Button } from 'react-native';
const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
import firestore from '../firestore';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';


export default class Map extends Component {
  constructor() {
    super();
    this.state = {
      location: null,
      errorMessage: null,
      markers: [],
      userPos: {}
    }
    this.handleGive = this.handleGive.bind(this);
    this.handleLook = this.handleLook.bind(this);
  };

  componentWillMount() {
    this._getLocationAsync();
  }

  handleLook(event) {
    console.log("Looking");
  }

  //   id: 2,
  //   latlng: { latitude: 40.70486398294511, longitude: -74.0088782067479 },
  //   title: 'marker-green',
  //   description: 'Now you can go...MOVE!!!'

  // Object {
  //   11:55:30:   "Coordinates": Object {
  //   11:55:30:     "coords": Object {
  //   11:55:30:       "accuracy": 20,
  //   11:55:30:       "altitude": 0,
  //   11:55:30:       "heading": 0,
  //   11:55:30:       "latitude": 40.7456107,
  //   11:55:30:       "longitude": -73.8703107,
  //   11:55:30:       "speed": 0,
  //   11:55:30:     },
  //   11:55:30:     "mocked": false,
  //   11:55:30:     "timestamp": 1525754668227,
  //   11:55:30:   },
  //   11:55:30: }

  handleGive(event) {
    console.log("Giving");
    firestore.collection('parkingSpots')
      .add({ Coordinates: this.state.location.coords })
      .then(() => firestore.collection('parkingSpots').get())
      .then(allSpots => {
        let tempMarkers = [];
        allSpots.forEach(spot => {
          // console.log(spot.data().Coordinates);
          console.log(spot.id);
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
      return Location.getCurrentPositionAsync({ enableHighAccuracy: true });
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
      <View>
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
