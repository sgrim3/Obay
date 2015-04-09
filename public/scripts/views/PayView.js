define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/views/DestroyableView'
], function ($, _, Backbone, DestroyableView) {
  var PayView = DestroyableView.extend({
    tagname: "div",
    id: "PayView",
    render: function (info){
      info.parentDiv.append(this.$el);
      this.$el.html(this.template());
      return this;
    },
  });

  return PayView;
});