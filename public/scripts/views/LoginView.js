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

      initialize: function (){
        this.template = _.template(LoginTemplate);    
      },

      render:function (info) {
          info.parentDiv.append(this.$el);
          this.$el.html(this.template());
          return this;
      }
  });

  return LoginView;
});
