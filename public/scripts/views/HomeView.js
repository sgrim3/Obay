define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/views/FeedView',
  'text!templates/HomeView.html'
], function ($, _, Backbone, FeedView, homeTemplate) {
  var HomeView = Backbone.View.extend({
    initialize:function () {
      this.template = _.template(homeTemplate);
      this.render();
    },

    render:function() {
      //must instantiate template before rendering subviews, since they mount onto the template!
      this.$el.html(this.template());


      this.FeedView = new FeedView({el: $('#feed_view_mount_point')});
      this.FeedView.render();
      return this;
    }
  });

  return HomeView;
});