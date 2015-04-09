define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/views/DestroyableView'
], function ($, _, Backbone, DestroyableView) {
  var AccountView = DestroyableView.extend({

    tagname: "div",
    id: "AccountView",

    initialize:function () {
      this.render();
    },
    render:function (info) {
        info.parentDiv.append(this.$el);
        this.$el.html(this.template());
        return this;
    }
  });

  return AccountView;
});