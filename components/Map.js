import React, { Component } from 'react';
import { MapView, Constants, Location, Permissions } from 'expo';
import { StyleSheet, Text, Dimensions, View, Platform } from 'react-native';
import { Button } from 'react-native-elements';
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
    marker: { latitude: 0, longitude: 0 },
    parkingSpots: '',
  }

  componentDidMount() {
    this._getLocationAsync()
    firestore.collection('parkingSpots').onSnapshot(allSpots => {
      let destinations = [];
      allSpots.docChanges.forEach(spot => {
        const spotObj = spot.doc.data().Coordinates;

        let newDestination = `${spotObj.latitude},${spotObj.longitude}`;
        destinations.push(newDestination);
      })
      destinations = destinations.join('|');

      const currentSpots = this.state.parkingSpots;
      if (currentSpots.length) {
        this.setState({ parkingSpots: `${currentSpots}|${destinations}` })
      } else {
        this.setState({ parkingSpots: destinations });
      }
    })
  }

  handleLook = () => {
    console.log("Looking");
    let origin = `${this.state.location.coords.latitude}, ${this.state.location.coords.longitude}`;
    let destination = this.state.parkingSpots;

    firestore.collection("users").where("email", "==", firebase.auth().currentUser.email).get()
      .then(allusers => {
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
          const finalMatch = { latitude: +perfectCoords[0], longitude: +perfectCoords[1] };


          this.setState({ marker: finalMatch });
        } else {
          return Promise.reject();
        }
      })

  }


  handleGive = () => {
    console.log("Giving");
    firestore.collection('parkingSpots')
      .add({
        Coordinates: this.state.location.coords,
        email: firebase.auth().currentUser.email,
      });
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

    return (
      <View style={styles.container}>

        <MapView style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}>

          <Marker coordinate={marker} />

        </MapView>

        <View style={styles.buttonsMapContainer}>

          <Button style={styles.button}
            title="Give up Parking!"
            onPress={this.handleGive}>
            Give up Parking!
          </Button>

          <Button style={styles.button}
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
    top: 25,
  },

  scrollview: {
    alignItems: 'center',
  },

  map: {
    flex: 1,
  },

  buttonsMapContainer: {
    backgroundColor: '#aabbff',
    width: 400,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 2,
    backgroundColor: '#aabbff',
  }
});


