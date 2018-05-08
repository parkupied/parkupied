import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, Button } from 'react-native';
// import { MapView } from 'expo';
import MapView, { Marker } from 'react-native-maps';


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




export default class App extends Component {
    state = {
        markers: []
    }
    handleAddUsersPosition = () => { 
        alert("ADDING USERS POSITION!!")
    }

    componentDidMount() {
        this.setState({ markers: fakeMarkers });
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
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
                    }}>

                    {this.state.markers.map(marker => (
                        <Marker
                            key={marker.id}
                            coordinate={marker.latlng}
                            title={marker.title}
                            description={marker.description}
                        />
                    ))}
                </MapView>
                <Button
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
        height: 600,
    },
})