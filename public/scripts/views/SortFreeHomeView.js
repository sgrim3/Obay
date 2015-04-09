define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/views/HomeView'
], function ($, _, Backbone, HomeView) {
  console.log(HomeView);
  var SortFreeHomeView = HomeView.extend({

    render:function() {
      //must instantiate template before rendering subviews, since they mount onto the template!
      this.$el.html(this.template());

      //
      var freeFilter = new FreeFeed()

      this.FeedView = new FeedView({
        el: $('#feed_view_mount_point'),
        feedModel: freeFilter
      });
      
      this.FeedView.render();
      return this;
    }
  });

  return SortFreeHomeView;
});  