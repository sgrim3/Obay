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
  
    initialize:function(info){
      this.template = _.template(NotFoundTemplate);
      info.parentDiv.append(this.$el);
      this.render();
    },

    render:function () {
      this.$el.html(this.template());
      return this;
    }
  });
  return NotFoundView;
});