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
import UserInfo from './UserInfo';



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
    showDirections: false,
    modalEmail: '',
    showNoPSAlert: false,
    showStopOfferButt: false,
    showFinalAlert: false,
  }

  componentDidMount() {
    this._getLocationAsync()
    firestore.collection('parkingSpots').onSnapshot(allSpots => {
      let destinations = [];
      let emails = [];
      allSpots.docChanges.forEach(spot => {
        if (Object.keys(spot.doc.data()).length) {
          const spotObj = spot.doc.data().Coordinates;
          const email = spot.doc.data().email;
          let newDestination = `${spotObj.latitude},${spotObj.longitude}`; //Leave this as spot obj
          destinations.push(newDestination);
          emails.push(email);
        }
      })
      destinations = destinations.join('|');
      const currentSpots = this.state.parkingSpots;
      if (currentSpots.length) {
        this.setState({ parkingSpots: `${currentSpots}|${destinations}` })
        //EMAIL?!?! Keep State as an array
      } else {
        this.setState({ parkingSpots: destinations, emails });
      }
    })
  }

  handleLook = () => {
    this.setState({ showLook: false, showGive: false });
    let origin = `${this.state.location.coords.latitude}, ${this.state.location.coords.longitude}`;
    let destination = this.state.parkingSpots;

    if (!this.state.parkingSpots.length) { // I made it to be dot-length, so that if it gets changed to an array, this doesn't need to change
      this.setState({ showNoPSAlert: true });
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${key}`

    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.status !== 'OK') {
          const errorMessage = json.error_message || 'Unknown error';
          throw errorMessage;
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
              //Calculation in the front end
              index = idx
            }
          })

          const availableSpots = destination.split('|');
          //^Unnecessary if in an array
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

  handleMatch = async () => {
    const coordinates = this.state.possibleMatch.coordinates;
    const matchingEmail = await this.state.possibleMatch.matchingEmail;
    const currUserEmail = firebase.auth().currentUser.email;
    this.setState({ showMatch: false, modalEmail: matchingEmail, matchedMarker: coordinates, showDirections: true, showStopOfferButt: false });
    firestore.collection('users').where('email', '==', matchingEmail).get().then(allUsers => {
      allUsers.forEach(user => {
        const id = user.id;
        //Updates your data with matched user email
        firestore.collection('users').doc(id).update({ matches: { email: currUserEmail, location: this.state.movinglocation } })
      })
    })
    firestore.collection('users').where('email', '==', currUserEmail).get().then(allUsers => {
      allUsers.forEach(user => {
        const id = user.id;
        firestore.collection('users').doc(id).update({ matches: { email: matchingEmail } });
      })
    })
  }

  handleCancel = async (deleteSpotBool) => {
    this.setState({ showMatch: false, showLook: true, showGive: true, possibleMatch: {}, showStopOfferButt: false });
    let id;
    if (deleteSpotBool) {
      await firestore.collection("parkingSpots").where("email", "==", firebase.auth().currentUser.email).get().then(spots => {
        spots.forEach(spot => {
          id = spot.id;
        })
      })
      firestore.collection("parkingSpots").doc(id).delete();
    }
  }



  handleGive = () => {
    //This query updates the parkingSpots table with the user coordinates
    firestore.collection('parkingSpots')
      .add({
        Coordinates: this.state.location.coords,
        email: firebase.auth().currentUser.email,
        confirmationCount: 0,
      });

      firestore.collection("users").where("email", "==", firebase.auth().currentUser.email).onSnapshot( matches => {
        matches.docChanges.forEach(match => {
          if (match.doc.data() && match.doc.data().matches && match.doc.data().matches.location) {
            const perfectCoords = match.doc.data().matches.location.split(',');
            const finalMatch = { latitude: +perfectCoords[0], longitude: +perfectCoords[1] };
            this.setState({ matchedMarker: finalMatch, modalEmail: match.doc.data().matches.email, showStopOfferButt: false })
          }
        })
      })

    this.setState({ showGive: false, showLook: false, showStopOfferButt: true })
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

  handleFinalizeTransaction = async () => {
    this.setState({ matchedMarker: { latitude: null, longitude: null }, showGive: true, showLook: true, showDirections: false });
    // Find the ParkingSpot
    // If this.stat.showDirections is true, then the current logged in user is not the email on parkingSpot
    const currEmail = firebase.auth().currentUser.email
    let spotEmail = this.state.showDirections ? false : currEmail;
    let secondEmail;

    await firestore.collection("users").where("email", "==", currEmail).get().then(allUsers => {
      allUsers.forEach(user => {
        // spotEmail = user.data().matches.email;
        // secondEmail = currEmail;
        if (spotEmail === currEmail) {
          secondEmail = user.data().matches.email;
        } else {
          spotEmail = user.data().matches.email;
          secondEmail = currEmail;
        }
      })
    })

    let spotId = '';
    await firestore.collection("parkingSpots").where("email", "==", spotEmail).get().then(allSpots => {
      allSpots.forEach(spot => {
        spotId = spot.id;
      })
    })
    let confCount = 0;
    await firestore.collection("parkingSpots").doc(spotId).get().then( spot => {
        confCount = spot.data().confirmationCount;
    })
    if (confCount === 0) {
      firestore.collection("parkingSpots").doc(spotId).update({
        confirmationCount: ++confCount
      })
      firestore.collection("parkingSpots").doc(spotId).onSnapshot(doc => {
        if (doc.data() && doc.data().confirmationCount === 2) {
          this.setState({ showFinalAlert: true });
        }
      })
    } else {
      // const secondEmail = (spotEmail === currEmail) ? get match email : currEmail;
      let firstId; let secondId; let firstPoints; let secondPoints;
      if (spotId) {
        firestore.collection("parkingSpots").doc(spotId).update({
          confirmationCount: ++confCount
        });
        await firestore.collection("parkingSpots").doc(spotId).delete();
      }

      await firestore.collection("users").where("email", "==", spotEmail).get().then(users => {
        users.forEach(user => {
          firstId = user.id;
        })
      })
      await firestore.collection("users").where("email", "==", secondEmail).get().then(users => {
        users.forEach(user => {
          secondId = user.id;
        })
      })
      // Now update
      firestore.collection("users").doc(firstId).update({ matches: {} });
      firestore.collection("users").doc(secondId).update({ matches: {} });
      this.setState({ showFinalAlert: true })
    }
    // Increment the Confirmation Count
    // If Conf Count == 2 then do other stuff // And show changes
  }

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
    let origin = `${location.latitude}, ${location.longitude}`;
    if (!this.state.showFinalAlert && !this.state.showMatch && !this.state.showNoPSAlert) this.setState({ movinglocation: origin });

    let matchingEmail = '';
    let myLocation = '';
    await firestore.collection('users').where('email', '==', firebase.auth().currentUser.email).get().then(allUsers => {
      allUsers.forEach(user => {
        const id = user.id;
        //Updates your data with matched user email
        if (user.data().matches.email) matchingEmail = user.data().matches.email;
        myLocation = user.data().location;
        firestore.collection('users').doc(id).update({ location: this.state.movinglocation })
      })
    })
    if (matchingEmail) {
      firestore.collection('users').where('email', '==', matchingEmail).get().then(allUsers => {
        allUsers.forEach(user => {
          const id = user.id;
          //Updates your data with matched user email
          firestore.collection('users').doc(id).update({ matches: { email: firebase.auth().currentUser.email, location: myLocation } })
        })
      })
    }
  }


  render() {
    const { location, marker, matchedMarker, possibleMatch, showMatch, showDirections, showGive, showLook, showNoPSAlert, showFinalAlert } = this.state;
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

        {showNoPSAlert ? Alert.alert(
          `It looks like no one is offering parking, sir.`,
          'Please try again later',
          [
            { text: 'Our deepest apologies.', onPress: () => this.setState({ showNoPSAlert: false, showGive: true, showLook: true }), style: 'cancel' }
          ],
          { cancelable: false }
        ) : null}

        {showFinalAlert ? Alert.alert(
          `You did it!!`,
          'The transaction was completed successfully. Please have a great day!',
          [
            { text: 'Parking is fun!', onPress: () => this.setState({ showNoPSAlert: false, showGive: true, showLook: true, modalEmail: '', showStopOfferButt: false, showFinalAlert: false }), style: 'cancel' }
          ],
          { cancelable: false }
        ) : null}

        {this.state.modalEmail ? this.state.modalEmail.length ? <UserInfo email={this.state.modalEmail} /> : null : null}

        {this.state.modalEmail ? this.state.modalEmail.length ? <Button 
          title="Confirm Transaction is Complete" onPress={this.handleFinalizeTransaction} /> : null : null}

        {this.state.showStopOfferButt ? <Button 
          title="Stop offering your Parking Spot" onPress={() => this.handleCancel(true)} /> : null}
          
        {showDirections ? <Button
          onPress={this.handleGetDirections} title="Get Directions" />
          : null}
          {/* {matchedMarker.latitude ? <Button
            title="Confirm Transaction"
            onPress={console.log("hi")}
          /> : null} */}
        {showGive ? <Button
          title="Give up Parking!"
          onPress={this.handleGive}/> : null}
        {showLook ? <Button
          title="Look For Parking!"
          onPress={this.handleLook} />
        : null}
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
