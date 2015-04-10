define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/views/NotFoundView',
  'scripts/views/DestroyableView',
  'text!templates/NotFoundView.html'
], function ($, _, Backbone, NotFoundView, DestroyableView, NotFoundTemplate) {
  var NotFoundView = DestroyableView.extend({
      tagname: "div",
      id: "NotFoundView",
    
      initialize:function(){
          this.template = _.template(NotFoundTemplate);
      },

      render:function (info) {
          info.parentDiv.append(this.$el);
          this.$el.html(this.template());
          return this;
      }

  });

  return NotFoundView;
});
