define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/views/DestroyableView',
  'text!templates/AccountTemplate.html'
], function ($, _, Backbone, DestroyableView, AccountTemplate) {
  var AccountView = DestroyableView.extend({

    tagname: "div",
    id: "AccountView",

    initialize: function(info){
        this.childView = [];
        this.template = _.template(AccountTemplate);
        this.model = info.model;
    },

    render:function (info) {
        info.parentDiv.append(this.$el);
        var self = this;
        this.model.fetch(function(){
            console.log(self.model.userData);
            self.$el.html(self.template(self.model.userData));
        });
        return this;
    },
  });

  return AccountView;
});
