define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/views/DestroyableView',

  'text!templates/PayView.html'
], function ($, _, Backbone, DestroyableView, PayTemplate) {
  var PayView = DestroyableView.extend({
    tagname: "div",
    id: "PayView",

    initialize: function (){
      this.template = _.template(PayTemplate);
    },

    render: function (info){
      info.parentDiv.append(this.$el);
      this.$el.html(this.template());
      return this;
    },
  });

  return PayView;
});
