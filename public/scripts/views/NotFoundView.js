define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/views/DestroyableView'
], function ($, _, Backbone, DestroyableView) {
  var NotFoundView = DestroyableView.extend({
      tagname: "div",
      id: "NotFoundView",

      render:function (info) {
          info.parentDiv.append(this.$el);
          console.log(this.template);
          this.$el.html(this.template());
          return this;
      }
  });

  return NotFoundView;
});