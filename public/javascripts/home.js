var $logout_button = $('#logout_button');

var on_logout_success = function(data, status) {
    //redirect on logout success
    window.location.replace('/');
}

$logout_button.click(function(event){
    console.log('submitted!');
    $.post('logout')
        .done(on_logout_success);
});
