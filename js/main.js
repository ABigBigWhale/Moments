$(function() {

    // Initialize Firebase
    /*var config = {
        apiKey: "AIzaSyD79RFKN1CVEPce8-jq6vSB50m6L3WPZAs",
        authDomain: "info343-a4.firebaseapp.com",
        databaseURL: "https://info343-a4.firebaseio.com",
        storageBucket: "info343-a4.appspot.com",
        messagingSenderId: "1026977934463"
    };
    firebase.initializeApp(config);*/

    var moments = firebase.database().ref('moments');
    var user;

    firebase.auth().getRedirectResult().then(function(result) {
        // When this operation succeeds, currentUser should be set.
        user = firebase.auth().currentUser;
        if (!user) {
            window.position('/signin.html');
        }
        
        initHeader();
        
    });

    var initHeader = function() {
        var userName = firebase.auth().currentUser.userName;
        var userPhotoURL = firebase.auth().currentUser.photoURL;

        console.log(user.displayName);
        $('#user-name').text(user.displayName);
        $('#user-photo').attr('src', user.photoURL);
    };
    
    $('#new-moment-form').on('submit', function(event){
        
    });

});