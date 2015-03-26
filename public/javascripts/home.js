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

var $venmo_pay_button = $('#venmo_pay_button');

var on_pay_attempt = function(data, status){
    if (data.not_authenticated) {
        window.location.replace('https://api.venmo.com/v1/oauth/authorize?client_id=2473&scope=make_payments%20access_profile');
    }
    if (data.message) {
        $('#pay_submit_message').html(data.message);
    }
};

$venmo_pay_button.click(function(event){
    event.preventDefault();
    console.log('pay button clicked!');
    var email = $('#venmo_email').val();
    $.post('venmoPay', {email:email})
        .done(on_pay_attempt);
});
