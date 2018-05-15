import React, { Component } from 'react';
import { MapView, Constants, Location, Permissions } from 'expo';
import { StyleSheet, Text, Dimensions, View, Platform, Alert } from 'react-native';
import { Button } from 'react-native-elements';
const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
import firestore from '../firestore';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { firebase } from '@firebase/app';
const key = 'AIzaSyDVmcW1my0uG8kBPgSHWvRhZozepAXqL_A';
import getDirections from 'react-native-google-maps-directions'
import MapViewDirections from 'react-native-maps-directions';



export default class Map extends Component {

  state = {
    movinglocation: null,
    location: null,
    errorMessage: null,
    marker: { latitude: null, longitude: null },
    matchedMarker: { latitude: null, longitude: null },
    parkingSpots: '',
    emails: [],
    showGive: true,
    showLook: true,
    showMatch: false,
    possibleMatch: {},
    showDirections: false
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

    // firestore.collection("users").where("email", "==", firebase.auth().currentUser.email).onSnapshot( matches => {
    //   matches.docChanges.forEach(match => {
    //     // snap.forEach(user => {

    //     console.log("match", match.doc.data().matches.location)
    //     if (match.type === "added") {
    //       console.log("change", match.doc.data().matches.location);
    //       this.setState({ matchedMarker: match.doc.data().matches.location});
    //     };
    //   })
    // })
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
          let duration = 0;
          //Instead of looking through the rows[0], make an object with key
          //being the address and value being time.
          const optimalRoute = json.rows[0].elements.map((nav, idx) => {
            if (nav.duration.value <= fastest.duration.value) {
              fastest = nav; //the actual match
              //The next two lines are taking the duration of the fastest route
              //which is in seconds, and converting it to minutes
              //rounded to the nearest tenth
              duration = fastest.duration.value / 60;
              duration = Math.round(duration * 10) / 10
              index = idx
            }
          })

          const availableSpots = destination.split('|');
          const perfectCoords = availableSpots[index].split(',');
          const finalMatch = { latitude: +perfectCoords[0], longitude: +perfectCoords[1] };
          const matchingEmail = this.state.emails[index];
          this.setState({ showMatch: true, possibleMatch: { coordinates: finalMatch, matchingEmail, duration } });
          // Finds the users who's parking spot we've matched with
        } else {
          return Promise.reject();
        }
      })
  }

  handleMatch = () => {
    this.setState({ showMatch: false });
    const coordinates = this.state.possibleMatch.coordinates;
    const matchingEmail = this.state.possibleMatch.matchingEmail;
    const currUserEmail = firebase.auth().currentUser.email;
    this.setState({ matchedMarker: coordinates, showDirections: true });
    firestore.collection('users').where('email', '==', matchingEmail).get().then(allUsers => {
      allUsers.forEach(user => {
        const id = user.id;
        //Updates your data with matched user email
        firestore.collection('users').doc(id).update({ matches: { email: currUserEmail, location: 'coordinates' } })
      })
    })
    firestore.collection('users').where('email', '==', currUserEmail).get().then(allUsers => {
      allUsers.forEach(user => {
        const id = user.id;
        firestore.collection('users').doc(id).update({ matches: { email: matchingEmail } });
      })
    })
  }

  handleCancel = () => {
    this.setState({ showMatch: false, showLook: true, showGive: true, possibleMatch: {} })
  }



  handleGive = () => {
    console.log("Giving");
    //This query updates the parkingSpots table with the user coordinates
    firestore.collection('parkingSpots')
      .add({
        Coordinates: this.state.location.coords,
        email: firebase.auth().currentUser.email,
      });

      firestore.collection("users").where("email", "==", firebase.auth().currentUser.email).onSnapshot( matches => {
        matches.docChanges.forEach(match => {
          // snap.forEach(user => {

          if (match.doc.data().matches.location) this.setState({ matchedMarker: match.doc.data().matches.location })
          console.log("match", match.doc.data().matches.location);

        })
      })

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

  handleGetDirections = () => {
    const data = {
      destination: this.state.matchedMarker,
      params: [
        {
          key: "travelmode",
          value: "driving"
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode
        }
      ]
    }

    getDirections(data)
  }

  onRegionChangeComplete = async (location) => {
    console.log('onRegionChangeComplete', location);
    let origin = `${location.latitude}, ${location.longitude}`;
    this.setState({ movinglocation: origin });

    let matchingEmail = '';
    await firestore.collection('users').where('email', '==', firebase.auth().currentUser.email).get().then(allUsers => {
      allUsers.forEach(user => {
        const id = user.id;
        //Updates your data with matched user email
        console.log(">>>>>>", user.data().matches);
        if (user.data().matches.email) matchingEmail = user.data().matches.email;
        firestore.collection('users').doc(id).update({ location: this.state.movinglocation })
      })
    })
    if (matchingEmail) {
      firestore.collection('users').where('email', '==', matchingEmail).get().then(allUsers => {
        allUsers.forEach(user => {
          const id = user.id;
          //Updates your data with matched user email
          firestore.collection('users').doc(id).update({ matches: { email: firebase.auth().currentUser.email, location: "this.state.movinglocation" } })
        })
      })
    }
  }


  render() {
    const { location, marker, matchedMarker, possibleMatch, showMatch, showDirections, showGive, showLook } = this.state;
    return (
      <View style={styles.container}>

        <MapView style={styles.map}
          onRegionChangeComplete={this.onRegionChangeComplete}
          showsUserLocation={true}
          followsUserLocation={true}
          onRegionChangeComplete={this.onRegionChangeComplete}>
          {marker.latitude ? <Marker
            coordinate={marker}
          /> : null}

          {matchedMarker.latitude ? <Marker
            coordinate={matchedMarker}
          /> : null}

        </MapView>
        {
          location &&
          <Text>{location.latitude}
            {location.longitude}
          </Text>
        }

        {showMatch ? Alert.alert(
          `Parking Spot Found ${possibleMatch.duration} minutes away!`,
          'Navigate there?',
          [
            { text: 'Lets Go!', onPress: () => this.handleMatch(), style: 'cancel' },
            { text: 'Cancel', onPress: () => this.handleCancel(), style: 'cancel' }
          ],
          { cancelable: false }
        ) : null}
        {showDirections ? <Button
          onPress={this.handleGetDirections} title="Get Directions" />
          : null}
        {showGive ? <Button
          title="Give up Parking!"
          onPress={this.handleGive}>
          Give up Parking!
        </Button> : null}
        {showLook ? <Button
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
