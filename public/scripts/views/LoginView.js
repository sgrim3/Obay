/*
Backbone view for login
Extends from DestroyableView
*/

define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/views/DestroyableView',

  'text!templates/LoginTemplate.html',
], function ($, _, Backbone, DestroyableView, LoginTemplate) {
  var LoginView = DestroyableView.extend({
      tagname: "div",
      id: "LoginView",

      initialize: function (info){
        this.template = _.template(LoginTemplate);  
        info.parentDiv.append(this.$el);
        this.render();
      },

      render:function (info) {
        this.$el.html(this.template({
          PORT: window.location.host
        }));
          
        return this;
      }
  });

  return LoginView;
});
