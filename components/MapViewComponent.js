import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Platform, Button, Dimensions } from 'react-native';
// import { MapView } from 'expo';
import { MapView } from 'expo';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';


//=============== MARKERS ==============//

const fakeMarkers = [{
    id: 1,
    latlng: {
        latitude: 40.704974242077, longitude: - 74.00892193530039
    },
    title: 'marker-yellow',
    description: 'You should wait until sunrize...'
}, {
    id: 2,
    latlng: { latitude: 40.70486398294511, longitude: -74.0088782067479 },
    title: 'marker-green',
    description: 'Now you can go...MOVE!!!'
}, {
    id: 3,
    latlng: { latitude: 40.7049265076983, longitude: -74.008905028838 },
    title: 'marker-red',
    description: 'Stay!!! You can`t moove...'
}, {
    id: 4,
    latlng: { latitude: 40.70482582822571, longitude: -74.00894416385496 },
    title: 'marker-green',
    description: 'Now you can go...MOVE!!!'
}, {
    id: 5,
    latlng: { latitude: 40.70494681109768, longitude: -74.00902127736411 },
    title: 'marker-yellow',
    description: 'You should wait until sunrize...'
}]

//====================================//

const { width, height } = Dimensions.get('window');


export default class App extends Component {
    state = {
        markers: [],
        userPos: {}
    }

    handleAddUsersPosition = () => {
        alert("ADDING USERS POSITION!!")
        let newMarker = {
            id: this.state.markers.length + 1,
            latlng: this.state.userPos,
            title: 'user-position',
            description: 'current user`s location.'
        }
        this.setState({ markers: this.state.markers.concat(newMarker) });
    }

    handleUserChangedlocation = (ev) => {
        //{ coordinate: LatLng }
        alert("======= users coords:", ev);
        this.setState({ userPos: { latitude: 40.70494681109768, longitude: -74.00902127736411 } })
        // this.setState({ userPos: ev.nativeEvent.coordinate })
    }

    componentDidMount() {
        this.setState({ markers: fakeMarkers });
    }

    render() {
        let LngLat = {
            longitude: this.state.userPos.longitude,
            latitude: this.state.userPos.latitude
        }

        return (
            <View style={styles.container}>
                <MapView
                   // {/* provider={PROVIDER_GOOGLE} */}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsCompass={true}
                    showsScale={true}
                    showsBuildings={true}
                    zoomEnabled={true}
                    style={styles.map}
                    initialRegion={{
                        latitude: 40.705,
                        longitude: -74.009,
                        latitudeDelta: 0.00922,
                        longitudeDelta: 0.00421,
                    }}
                    onUserLocationChange={this.handleUserChangedlocation}
                >

                    {this.state.markers.map(marker => (
                        <Marker
                            key={marker.id}
                            coordinate={marker.latlng}
                            title={marker.title}
                            description={marker.description}
                        />
                    ))}

                </MapView>

                <Text style={styles.container}>lng:{LngLat.longitude}</Text>
                <Text style={styles.container}>lat:{LngLat.latitude}</Text>

                <Button
                    // {/* onPress={this.handleAddUsersPosition} */}
                    onPress={this.handleUserChangedlocation}
                    title="ChangeLocation"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />

                <Button
                    // {/* onPress={this.handleAddUsersPosition} */}
                    onPress={this.handleAddUsersPosition}
                    title="AddUsersPosition"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />

            </View>
        );
    }
}

//=================================== STYLES ==============================//

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    map: {
        width: 350,
        height: 500,
    },
})

// AppRegistry.registerComponent('GoogleMapPlayground', () => GoogleMapPlayground);  ????????