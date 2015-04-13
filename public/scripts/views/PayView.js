define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/views/DestroyableView',

  'text!templates/PayTemplate.html'
], function ($, _, Backbone, DestroyableView, PayTemplate) {
  var PayView = DestroyableView.extend({
    tagname: "div",
    id: "PayView",

    events: {
      'click #cashButton': 'cashPay',
      'click #venmoButton': 'venmoPay',
    },

    initialize: function (info){
      this.template = _.template(PayTemplate);
      this.model = info.model;
    },

    render: function (info){
      //purposely mounts after parentDiv instead of into it.
      info.parentDiv.after(this.$el);
      this.$el.html(this.template());
      return this;
    },

    cashPay: function (){
      console.log('cashpay called!');
    },

    venmoPay: function (){
      $.post('venmoPay', this.model.attributes)
        .done(function(response){
          $('#venmoMessage').text(response.message);
        })
        .error(function(response){
          switch (response.status) {
            case 401:
              //TODO: redirect to venmo or redirect to home to login depending on which kind of unauthorized 
              //redirect to venmo! but first, post the current url to the server so that we can return to this page
              $.post('setVenmoPayRedirect', {url: window.location.href})
                .done(function(response){
                  window.location.replace('https://api.venmo.com/v1/oauth/authorize?client_id=2492&scope=make_payments%20access_profile&redirect_uri=http://127.0.0.1:3000/venmoAuth/redirect');
                })
                .error(function(response){
                  console.log('Error setting venmo pay redirect url!');
                });
              break;
            case 400:
              $('#venmoMessage').text(response.responseJSON.message);
              break;
          }
        });
    },

  });

  return PayView;
});
