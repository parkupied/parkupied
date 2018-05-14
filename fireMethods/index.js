import firebase from 'firebase';
import firestore from '../firestore';

async function signup (name, phone, email, password, carMake, carModel, carColor, license) {

    email = email.toLowerCase();
    for (let i = 0; i < arguments.length; i++) {
        if (!arguments[i].length) return "Please enter information for all fields.";
    }
    if (password.length < 6) return "Password must be at least 6 characters.";
    //It might be cool to validate phone number and license with regex, but whatever

    // Auth Signup
    await firebase.auth().createUserWithEmailAndPassword(email, password).catch(err => {
        console.error(err).bind(console);
        return `It seems there was an error: ${err}`; // I don't know when this could hit..
    });

    // DB Signup
    await firestore.collection("users").add({
        name,
        phone,
        email,
        password,
        car: {
            carMake,
            carModel,
            carColor,
            license,
        },
        tokens: 0,
        rating: 0,
        strikes: 0,
        location: [],
        match: {},
        pastMatches: []
    });
    return true;
}

// Login
async function login (email, password) {
    email = email.toLowerCase();
    let exists = false;
    await firestore.collection("users").where("email", "==", email).get()
        .then(allUsers => {
            allUsers.forEach(user => {
                exists = true;
            })
        });
    if (exists) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(err => {
            console.error(err).bind(console);
            return "It would seem that you have the wrong password."; //Hopefully
        });
        return true; // This is the successful login case
    } else {
        return "That is not a registered user. Try a different email or signing up.";
    }
}

export { signup,login };
