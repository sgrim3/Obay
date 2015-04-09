define([
  'jquery', 
  'underscore', 
  'backbone',
], function ($, _, Backbone) {
    var DestroyableView = Backbone.View.extend({
        tagname: "div",
        id: "DestroyableView",

        initialize: function () {
            this.childViews = [];
        },

        destroy:function () {
            //destroys view and corresponding mount point /$el
            this.childViews.forEach( function (childView) {
                //destroy all child views!
                childView.destroy();
            });
            // COMPLETELY UNBIND THE VIEW
            this.undelegateEvents();
            this.$el.removeData().unbind(); 
            // Remove view from DOM
            this.remove();  
            Backbone.View.prototype.remove.call(this);
            return this;
        },
    });

    return DestroyableView;
});