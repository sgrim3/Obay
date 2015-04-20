define([
  'backbone',
], function (Backbone) {
  var BaseModel = Backbone.Model.extend({
    dispose: function() {
      // same as this.$el.remove();
      this.remove();

      // unbind events that are
      // set on this view
      this.off();

      // remove all models bindings
      // made by this view
      this.model.off( null, null, this );
    }
  });

  // QUESTION: There's nothing in BaseModel? What's its purpose?
  return BaseModel;
});
