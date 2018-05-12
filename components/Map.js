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
    marker: { latitude: null, longitude: null },
    matchedMarker: { latitude: null, longitude: null },
    parkingSpots: '',
    emails: [],
    showGive: true,
    showLook: true
  }

  componentDidMount() {
    this._getLocationAsync()
    firestore.collection('parkingSpots').onSnapshot(allSpots => {
      let destinations = [];
      let emails = [];
      allSpots.docChanges.forEach(spot => {
        const spotObj = spot.doc.data().Coordinates;
        const email = spot.doc.data().email;
        let newDestination = `${spotObj.latitude},${spotObj.longitude}`;
        destinations.push(newDestination);
        emails.push(email)
      })
      destinations = destinations.join('|');

      const currentSpots = this.state.parkingSpots;
      if (currentSpots.length) {
        this.setState({ parkingSpots: `${currentSpots}|${destinations}` })
      } else {
        this.setState({ parkingSpots: destinations, emails });
      }
    })
  }

  handleLook = () => {
    this.setState({ showLook: false, showGive: false });
    console.log("Looking");
    let origin = `${this.state.location.coords.latitude}, ${this.state.location.coords.longitude}`;
    let destination = this.state.parkingSpots;


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
          const matchingEmail = this.state.emails[index];
          this.setState({ marker: finalMatch });
          const currUserEmail = firebase.auth().currentUser.email;
          // Finds the users who's parking spot we've matched with
          firestore.collection('users').where('email', '==', matchingEmail).get().then(allUsers => {
            allUsers.forEach(user => {
              const id = user.id;
              //Updates your data with matched user email
              firestore.collection('users').doc(id).update({ matches: { email: currUserEmail, location: this.state.location.coords } })
            })
          })
          firestore.collection('users').where('email', '==', currUserEmail).get().then(allUsers => {
            allUsers.forEach(user => {
              const id = user.id;
              firestore.collection('users').doc(id).update({ matches: { email: matchingEmail } });
            })
          })
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

    // Firestore should listen for a snapshot (change) in your match property
    var unsubscribe = firestore.collection("users").where("email", "==", firebase.auth().currentUser.email).onSnapshot(snap => {
      snap.docChanges.forEach(user => {
        if (user.doc.data().matches !== {}) {
          firestore.collection("users").where("email", "==", user.matches.email).get()
            .then(allusers => { // this should really only be one user.
              allusers.forEach(user => {
                let lat = user.matches.location.latitude;
                let long = user.matches.location.longitude;
                let coords = {latitude: lat, longitude: long};
                this.setState({ matchedMarker: coords})
                //Display something to the user. "Match Found!""
              })
            })
        };
      })
    })
    // And then do whatever
    // And then stop listening
    unsubscribe();
    this.setState({ showGive: false, showLook: false })
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

  onRegionChangeComplete(location) {
    // console.log("onRegionChangeComplete: ", location);
    // Tell Firestore to update ??
  }

  render() {
    const { location, marker, matchedMarker } = this.state;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          onRegionChangeComplete={this.onRegionChangeComplete}>
        {marker.latitude ?  <Marker
          coordinate={marker}
        /> : null }
        {matchedMarker.latitude ?  <Marker
          coordinate={matchedMarker}
        /> : null }

        </MapView>
        {
          this.state.location &&
          <Text>{this.state.location.latitude}
            {this.state.location.longitude}
          </Text>
        }
        {this.state.showGive ? <Button
          title="Give up Parking!"
          onPress={this.handleGive}>
          Give up Parking!
        </Button> : null}
        {this.state.showLook ?  <Button
          title="Look For Parking!"
          onPress={this.handleLook}>
          Look for Parking!
        </Button> : null}

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


