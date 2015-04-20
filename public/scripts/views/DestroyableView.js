define([
  'jquery', 
  'underscore', 
  'backbone',
], function ($, _, Backbone) {
    var DestroyableView = Backbone.View.extend({
        tagname: "div",
        id: "DestroyableView",

        constructor: function (attributes, options) {
            this.childViews = [];
            //line below does what the backbone constructor should actually do
            Backbone.View.apply(this, arguments);
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


            // Destroy any associated models and collections.
            // if (this.collection) {
            //     this.collection.reset();
            //     this.collection.unbind();
            //     delete this.collection;
            //     console.log("about to destroy");
            //     // this.collection.destroyAll();
            // }

            Backbone.View.prototype.remove.call(this);
            return this;
        },
    });

    return DestroyableView;
});
