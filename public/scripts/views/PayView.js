define([
  'jquery', 
  'underscore', 
  'backbone',
], function ($, _, Backbone) {
  var PayView = Backbone.View.extend({
    initialize:function () {
      this.render();
    },

    render: function (){
      this.$el.html(this.template());
      return this;
    },
  });

  return PayView;
});