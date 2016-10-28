$(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD79RFKN1CVEPce8-jq6vSB50m6L3WPZAs",
        authDomain: "info343-a4.firebaseapp.com",
        databaseURL: "https://info343-a4.firebaseio.com",
        storageBucket: "info343-a4.appspot.com",
        messagingSenderId: "1026977934463"
    };
    firebase.initializeApp(config);

    // Sign Up: Function to create account on firebase, then redirect to index.html
    var signUp = function() {
        // Get email, password, and display name
        var email = $('#email').val();
        var password = $("#password").val();
        var userName = $('#user-name').val();
        var photoFile = $('#profile-photo-upload')[0].files[0];

        // Create user, then set the user's display name
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(user) {

            var photoRef = firebase.storage().ref(photoFile.name)
            photoRef.put(photoFile).then(function(){
                photoRef.getDownloadURL().then(function(photoURL){
                    // Set display name and profile photo URL
                    user.updateProfile({
                        displayName: userName,
                        photoURL: photoURL
                    }).then(function() {
                        window.location = '/';
                    });
                });
            });
        })
            .catch(function(error) {
            alert(error.message);
        });
    };

    // Sign In: Function to authenticate on Firebase, then redirect to index.html
    var signIn = function() {
        // Get email and password
        var email = $('#email').val();
        var password = $("#password").val();

        // Authenticate using email and password, then redirect
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function() {
            window.location = '/';
        })
            .catch(function(error) {
            alert(error);
        });
    };

    // Sign out: Function to log a user out of firebase
    var signOut = function() {
        // Sign out, then redirect
        firebase.auth().signOut().then(function() {
            window.location = 'signin.html';
        });
    };

    // Assign event lister to form submission
    $('#form').on('submit', function(event) {
        event.preventDefault();
        if (global.isSignIn) {
            console.log("signing in...");
            signIn();
        } else {
            console.log("signing up...");
            signUp();
        }
    });

    // Assign click event to logout button
    $('#log-out').on('click', function() {
        console.log("logging out...")
        signOut();
    });

    // Authentication Change: see if a user is already signed in, and redirect
    var checked;
    firebase.auth().onAuthStateChanged(function(user) {
        if (checked !== true) {
            // Rediriect to index.html if there is a user and the pathname isn't '/'
            if (user && window.location.pathname != '/') {
                window.location = '/';
            }

            // Redirect to sign-in if there is NOT a user and the pathname IS '/'
            if (!user && window.location.pathname == '/') {
                window.location = 'sign-in.html';
            }
            checked = true;
        }
    });


});