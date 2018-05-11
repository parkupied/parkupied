import React, { Component } from 'react';
import { MapView, Constants, Location, Permissions } from 'expo';
import { StyleSheet, Text, Dimensions, View, Platform, Button } from 'react-native';
const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
import firestore from '../firestore';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { firebase } from '@firebase/app';
const key = 'AIzaSyDVmcW1my0uG8kBPgSHWvRhZozepAXqL_A';

export default class Map extends Component {

    state = {
      location: null,
      errorMessage: null,
      marker: {latitude:0,longitude:0},
      parkingSpots: null
    }

  componentDidMount() {
    this._getLocationAsync()
    firestore.collection('parkingSpots').get()
      .then(allSpots => {
        let tempMarkers = [];
        let destinations = [];
        allSpots.forEach(spot => {
          const spotObj = spot.data().Coordinates;
          const latlng = { latitude: spotObj.latitude, longitude: spotObj.longitude };
          const id = spot.id;

          let newMarker = {
            id,
            latlng
          }
          let newDestination = `${spotObj.latitude},${spotObj.longitude}`
          tempMarkers.push(newMarker);
          destinations.push(newDestination);
        });
        destinations = destinations.join('|');
        this.setState({ parkingSpots: destinations});
      })
  }

  handleLook = () => {
    console.log("Looking");
    let origin = `${this.state.location.coords.latitude}, ${this.state.location.coords.longitude}`;
    let destination = this.state.parkingSpots;
    console.log("USER: ", firebase.auth().currentUser.email);

    firestore.collection("users").where("email", "==", firebase.auth().currentUser.email).get()
      .then(allusers => {
        // //console.log(allusers);
        // console.log(Object.keys(allusers));
        // // console.log(allusers._firestore);
        // console.log(Object.keys(allusers._firestore));
        // console.log(allusers._firestore.INTERNAL);
        allusers.forEach(user => {
          console.log(user.data().email);
        })
      })

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${key}`

    return fetch(url)
      .then(response => response.json())
      .then(json => {
				if (json.status !== 'OK') {
					const errorMessage = json.error_message || 'Unknown error';
					return Promise.reject(errorMessage);
				}

				if (json.rows.length) {

          let fastest = json.rows[0].elements[0];
          let index = 0;
          //Instead of looking through the rows[0], make an object with key
          //being the address and value being time.
          const optimalRoute = json.rows[0].elements.map((nav, idx) => {
            if (nav.duration.value < fastest.duration.value) {
              fastest = nav; //the actual match
              index = idx
            }
          })

          const availableSpots = destination.split('|');
          const perfectCoords = availableSpots[index].split(',');
          const finalMatch = {latitude: +perfectCoords[0], longitude: +perfectCoords[1]};



          this.setState({marker: finalMatch});
				} else {
					return Promise.reject();
				}
      })

  }


  handleGive = () =>  {
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
    this.setState({ location });
  };





  render() {
    const { location, marker } = this.state;
    // console.log(this.state.marker);
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}>


            <Marker
              coordinate={marker}
             />

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


