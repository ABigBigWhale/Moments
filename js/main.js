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

    moments.on('child_added', function(snapshot){
        var data = snapshot.val();
        renderMoment(snapshot.key, data);
    });
    
    moments.on('child_changed', function(snapshot){
        updateMoment(snapshot.key, snapshot.val());
    });

    var initHeader = function() {
        var userName = firebase.auth().currentUser.userName;
        var userPhotoURL = firebase.auth().currentUser.photoURL;

        console.log(user.displayName);
        $('#user-name').text(user.displayName);
        $('#user-photo').attr('src', user.photoURL);
    };

    var renderMoment = function(id, data) {
        var momentUserPhoto = $('<img>', {class: 'profile-photo', src: data.photoURL});
        var momentText = $('<div>', {class: 'moment-text'}).append($('<p>', {text: data.momentText}));
        var momentLikeCount = $('<span>', {class: 'like-count', text: data.likeCount});

        var momentCard = $('<div>', {class: 'row'}).append(
            $('<div>', {class: 'card moment-card', id: id}).append(
                $('<div>', {class: 'card-content moment-content'}).append(
                    $('<div>', {class: 'photo-container moment-user-photo-container'}).append(
                        momentUserPhoto
                    )
                ).append(
                    momentText
                )
            ).append(
                $('<div>', {class: 'card-action'}).append(
                    $('<i>', {class: 'fa fa-heart-o clickable', 'aria-hidden': 'true'})
                ).append(
                    momentLikeCount
                )
            )
        )

        momentCard.css('display', 'none');

        $('#moments-container').prepend(momentCard);

        momentCard.slideDown();
    }
    
    var updateMoment = function(id, data) {
        var momentCard = $('#' + id);
        momentCard.find($('.profile-photo')).replaceWith(
            $('<img>', {class: 'profile-photo', src: data.photoURL})
        );
        momentCard.find($('.moment-text')).replaceWith(
            $('<div>', {class: 'moment-text'}).append($('<p>', {text: data.momentText}))
        );
        momentCard.find($('.like-count')).replaceWith(
            $('<span>', {class: 'like-count', text: data.likeCount})
        );
        
    }

    $('#submit-new-moment').click(function(){
        console.log("new moment!")
        $('#form-new-moment').submit();
    });

    $('#form-new-moment').on('submit', function(event){
        event.preventDefault();
        
        moments.push({
            photoURL: user.photoURL,
            momentText: $('#new-moment').val(),
            likeCount: 0
        });

        $('#new-moment').val('').css('height', 'auto');
    });
    
    $('#moments-container').on('click', 'i.fa-heart-o, i.fa-heart', function(){
        var momentId = $(this).closest('.moment-card').attr('id');
        console.log(momentId);
        moments.child(momentId).once('value').then(function(snapshot){
            console.log(snapshot.val().likeCount);
            var prevCount = snapshot.val().likeCount;
            moments.child(momentId).update({likeCount: prevCount + 1});
        });
        $(this).toggleClass('fa-heart-o').toggleClass('fa-heart');
    });

});