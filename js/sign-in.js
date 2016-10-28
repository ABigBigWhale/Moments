$(document).ready(function() {

    var btnSignIn = $('#btn-sign-in');
    var btnSignUp = $('#btn-sign-up');

    btnSignIn.css('background-color', '#26a69a');

    btnSignIn.click(function() {
        if (!global.isSignIn) {
            global.isSignIn = true;
            $('#container-sign-up-options').slideUp();
            $(this).css('background-color', '#26a69a');
            btnSignUp.css('background-color', '#607D8B');
        } else {
            $('form').submit();
        }
    });

    btnSignUp.click(function() {
        if (global.isSignIn) {
            global.isSignIn = false;
            $('#container-sign-up-options').slideDown();
            $(this).css('background-color', '#26a69a');
            btnSignIn.css('background-color', '#607D8B');
        } else {
            $('form').submit();
        }
    });
    
    // Update the profile photo preview if image uploaded
    $('#profile-photo-upload').change(function(){
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(imgFile) {
                $('#profile-photo-preview').attr('src', imgFile.target.result);
                $('#profile-photo-preview').css('display', 'inline');
            }
            console.log("adding img!!");
            reader.readAsDataURL(this.files[0]);
        }
    });

});