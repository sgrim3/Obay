define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/views/DestroyableView',

  'text!templates/LoginView.html',
], function ($, _, Backbone, DestroyableView, loginTemplate) {
  var LoginView = DestroyableView.extend({
      tagname: "div",
      id: "LoginView",

      initialize: function (){
        this.template = _.template(loginTemplate);    
      },

      render:function (info) {
          info.parentDiv.append(this.$el);
          this.$el.html(this.template());
          return this;
      }
  });

  return LoginView;
});
