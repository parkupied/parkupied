import * as firebase from 'firebase';
import 'firebase/firestore';

var config = {
	apiKey: 'AIzaSyDEJFDnT7LQJE6K1zn3uw_eM2ELHS-n-Yk',
	authDomain: 'parkupied.firebaseapp.com',
	databaseURL: 'https://parkupied.firebaseio.com',
	projectId: 'parkupied',
	storageBucket: 'parkupied.appspot.com',
	messagingSenderId: '641475186680'
};

firebase.initializeApp(config);

const firestore = firebase.firestore();

const settings = {
	timestampsInSnapshots: true
};
firestore.settings(settings);

export default firestore;
