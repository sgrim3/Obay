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
      // FIXME: Can these two statements be combined?
      this.listenTo(this.model, 'add', this.render);
      this.listenTo(this.model, 'change', this.render);
      this.model.fetch();
    },

    render:function(){
      // TODO: Refactor this so that the UserModel is handling this action.
      this.$el.html(this.template(this.model.attributes));
      console.log(this.model.attributes.userId);
      var feedView = new FeedView({
        parentDiv: $('#FeedViewMountPoint'),
        feedCollection: new userFeed(this.model.attributes.userId)
      });
      this.childViews.push(feedView);
      return this;
    },
  });

  return AccountView;
});
