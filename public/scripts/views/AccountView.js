/*
Backbone view for Account page
Extends from DestroyableView
*/

define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/collections/feed',
  'scripts/views/FeedView',
  'scripts/views/DestroyableView',
  'text!templates/AccountTemplate.html'
], function ($, _, Backbone, Feed, FeedView, 
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
      this.$el.html(this.template($.extend(
        {}, 
        this.model.attributes,
        {PORT: window.location.host}
      )));
      return this;
    },

  });

  return AccountView;
});
