define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/collections/userFeed',
  'scripts/views/FeedView',
  'scripts/views/DestroyableView',
  'text!templates/AccountTemplate.html'
], function ($, _, Backbone, userFeed, FeedView, 
  DestroyableView, AccountTemplate) {
  var AccountView = DestroyableView.extend({

    tagname: "div",
    id: "AccountView",

    initialize: function(options){
      options.parentDiv.append(this.$el);
      this.template = _.template(AccountTemplate);
      this.model = options.model;
      this.listenTo(this.collection, 'reset', this.render);

      this.model.fetch();
    },

    render:function(){
      // TODO: Refactor this so that the UserModel is handling this action.
      this.$el.html(this.template(this.model.attributes));
      
      console.log(this.model.attributes.userId);
      var feedView = new FeedView({
        feedCollection: new userFeed(this.model.attributes.userId)
      });

      this.childViews.push(feedView);

      // TODO: Change render information.
      feedView.render({parentDiv: $('#FeedViewMountPoint')});
      return this;
    },
  });

  return AccountView;
});