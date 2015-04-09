define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!templates/LoginView.html',
], function ($, _, Backbone, loginTemplate) {
	var LoginView = Backbone.View.extend({

	  initialize:function () {
      this.template = _.template(loginTemplate);
	    this.render();
	  },

	  render:function () {
	    this.$el.html(this.template());
	    return this;
	  }
	});

	return LoginView;
});