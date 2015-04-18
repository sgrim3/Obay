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

    initialize: function(info){
      info.parentDiv.append(this.$el);
      this.template = _.template(AccountTemplate);
      this.model = info.model;

      this.render();
    },

    render:function (info) {
        var _this = this;

        // TODO: Refactor this so that the UserModel is handling this action.
        this.model.fetch(function(){
          _this.$el.html(_this.template(_this.model.attributes));
          console.log(_this.model.attributes.userId);
          var feedView = new FeedView({
            feedCollection: new userFeed(_this.model.attributes.userId)
          });
          _this.childViews.push(feedView);
          feedView.render( {parentDiv: $('#FeedViewMountPoint')} );
        });
        return this;
    },
  });

  return AccountView;
});