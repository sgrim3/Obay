define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/collections/feed',
  
  'scripts/views/DestroyableView',
  'scripts/views/FeedView',
  
  'text!templates/HomeView.html'
], function ($, _, Backbone, Feed, DestroyableView, FeedView, homeTemplate) {
  var HomeView = DestroyableView.extend({
      tagname: "div",
      id: "HomeView",
    
      initialize:function(){
          this.template = _.template(homeTemplate);
      },

      render:function(info) {
          //must instantiate template before rendering subviews, since they mount onto the template!
          info.parentDiv.append(this.$el);
          this.$el.html(this.template());
          var feedView = new FeedView( {feedModel: new Feed()} );

          this.childViews.push(feedView);

          feedView.render( {parentDiv: $('#FeedViewMountPoint')} );
          return this;
      },
  });

  return HomeView;
});
