define([
  'jquery', 
  'underscore', 
  'backbone',
], function ($, _, Backbone) {
  var NotFoundView = Backbone.View.extend({

    initialize:function () {
      this.render();
    },

    render:function () {
      this.$el.html(this.template());
      return this;
    }

  });

  return NotFoundView;
});