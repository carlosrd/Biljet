$(document).ready(function() {

    $('#signup_submit').click(function () {
        var hashPass = CryptoJS.MD5($('#password').val()).toString();
        $('#password').val(hashPass);
        $('#signup_submit').submit();
    });

});