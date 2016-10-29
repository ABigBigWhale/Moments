$(document).ready(function() {

    var moments = firebase.database().ref('moments');
    var viewType = 'view-newest';
    var user;

    $(".dropdown-button").dropdown();

    firebase.auth().getRedirectResult().then(function(result) {
        // When this operation succeeds, currentUser should be set.
        user = firebase.auth().currentUser;
        if (!user) {
            window.location = './signin.html';
        }

        initHeader();

    });

    moments.on('child_added', function(snapshot){
        var data = snapshot.val();
        if (viewType == 'view-newest') renderMoment(snapshot.key, data);
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
        var momentLikeIcon = currentUserLiked(data) ? 'fa-heart' : 'fa-heart-o';



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
                    $('<i>', {class: 'fa ' + momentLikeIcon + ' clickable', 'aria-hidden': 'true'})
                ).append(
                    momentLikeCount
                )
            )
        )

        momentCard.css('display', 'none');
        $('#moments-container').prepend(momentCard);
        momentCard.slideDown();
    };

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

    };

    var reloadMoment = function(view) {
        moments.once('value').then(snapshot => {
            var allMoments = Object.keys(snapshot.val()).map(key => {
                var moment = snapshot.val()[key];
                moment.momentId = key;
                return moment;
            });

            console.log(allMoments);

            $('#moments-container').empty();
            if (view == 'view-hottest') {
                allMoments.sort( (m1, m2) => parseInt(m1.likeCount) - parseInt(m2.likeCount) );
            }

            allMoments.forEach(moment => {
                var momentId = moment.momentId;
                delete moment.momentId;
                renderMoment(momentId, moment);
            });
        });
    };

    var currentUserLiked = function(moment) {
        
        if ('likedUsers' in moment) {
            
            for (var key in moment.likedUsers) {
                if (moment.likedUsers[key] == user.uid) {
                    return key;
                }
            }

        }
        
        return null;
    }

    $('#submit-new-moment').click(function(){
        console.log("new moment!")
        $('#form-new-moment').submit();
    });
    
    $("#new-moment").keypress(function (e) {
        if(e.which == 13) {
            e.preventDefault();
            if ($(this).val()) $('#form-new-moment').submit();
        }
    });

    $('#form-new-moment').on('submit', function(event){
        event.preventDefault();

        moments.push({
            photoURL: user.photoURL,
            momentText: $('#new-moment').val(),
            likeCount: 0,
            likedUsers: {}
        });

        $('#new-moment').val('').css('height', 'auto');
    });

    $('#moments-container').on('click', 'i.fa-heart-o, i.fa-heart', function(){
        var heartIcon = $(this);
        var momentId = $(this).closest('.moment-card').attr('id');
        var moment = moments.child(momentId);

        moment.once('value').then(function(snapshot){
            var prevCount = snapshot.val().likeCount;
            var userLikeKey = currentUserLiked(snapshot.val());
            console.log(userLikeKey);

            if (!userLikeKey) {
                moment.child('likedUsers').push(user.uid);
                moment.update({likeCount: prevCount + 1});
                if (!heartIcon.hasClass('fa-heart')) heartIcon.addClass('fa-heart');
                if (heartIcon.hasClass('fa-heart-o')) heartIcon.removeClass('fa-heart-o');
            } else {
                moment.child('likedUsers').child(userLikeKey).remove();
                moment.update({likeCount: prevCount - 1});
                if (!heartIcon.hasClass('fa-heart-o')) heartIcon.addClass('fa-heart-o');
                if (heartIcon.hasClass('fa-heart')) heartIcon.removeClass('fa-heart');
            }

        });
    });

    $('.view-select-list').on('click', '.clickable', function(){
        var newViewType = $(this).attr('id');
        $(this).closest('.view-select').siblings().removeClass('active');
        $(this).closest('.view-select').addClass('active');

        if (newViewType != viewType) {
            viewType = newViewType;
            reloadMoment(viewType);
        }

        console.log(viewType);
    });

});