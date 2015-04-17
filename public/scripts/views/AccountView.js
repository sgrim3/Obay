define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/collections/userFeed',
  'scripts/views/FeedView',
  'scripts/views/DestroyableView',
  'text!templates/AccountTemplate.html'
], function ($, _, Backbone, userFeed, FeedView, DestroyableView, AccountTemplate) {
  var AccountView = DestroyableView.extend({

    tagname: "div",
    id: "AccountView",

    initialize: function(info){
        this.template = _.template(AccountTemplate);
        this.model = info.model;
    },

    render:function (info) {
        info.parentDiv.append(this.$el);
        var self = this;
        this.model.fetch(function(){
          self.$el.html(self.template(self.model.attributes));
          console.log(self.model.attributes.userId);
          var feedView = new FeedView( {feedCollection: new userFeed(self.model.attributes.userId)} );
          self.childViews.push(feedView);
          feedView.render( {parentDiv: $('#FeedViewMountPoint')} );
        });
        return this;
    },
  });

  return AccountView;
});
