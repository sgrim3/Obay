/*
Backbone view pay popup (after buy button is clicked)
Extends from DestroyableView
Contains venmo and cash buttons + logic
*/

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
      info.parentDiv.append(this.$el);

      // TODO: Set conditional on what to render.
      console.log(this.model);
      this.render();
    },

    render: function (info){
      // Purposely mounts after parentDiv instead of into it.
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

    cashPay: function (){
      //TODO send email to buyer and seller
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
              /*TODO: redirect to venmo or redirect to home to login depending 
              on which kind of unauthorized redirect to venmo! but first, post 
              the current url to the server so that we can return to this page*/
              $.post('setVenmoPayRedirect', {url: window.location.href})
                .done(function(response){
                  window.location.replace('https://api.venmo.com/v1/oauth/' 
                    + 'authorize?client_id=2492&scope=make_payments%20' 
                    + 'access_profile&redirect_uri=http://' + window.location.host 
                    + '/venmoAuth/redirect');
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
