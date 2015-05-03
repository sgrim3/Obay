/*
Backbone view for single listing
Extends from DestroyableView
Contains edit and buy buttons + logic
*/

define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/models/listing',

  'scripts/views/DestroyableView',
  'scripts/views/PayView',

  'text!templates/ListingTemplate.html',
], function ($, _, Backbone, Listing, DestroyableView, PayView, 
  ListingTemplate) {
    var ListingView = DestroyableView.extend({
      tagname: "div",
      id: "ListingView",

    events: {   
      'click #buyButton': 'buyItem',  
      'click #editButton': 'editItem',  
    },

    initialize:function (info) {
      var _this = this;

      this.template = _.template(ListingTemplate);
      info.parentDiv.append(this.$el);

      this.model.fetch({reset: true});
      // this.listenTo(this.model, 'sync', this.render);
      /*This is what lets you update the model 
      with new info and listen for it.*/
      this.listenTo(this.model, 'change', this.render);
    },

    render: function (){
      console.log("Rendering listing.");
      var _this = this;

      // TODO: Convert this into JQuery.
      document.getElementById("addButton").style.display="none";
      _this.$el.html(this.template(this.model.attributes));

      // Initialize the listing has been closed.
      if (!this.model.attributes.listing_open) {
        console.log("New payview created!");
        var payView = new PayView({
          model: _this.model,
          parentDiv: $('.pay-mount-point')
        });
      }

      return this;
    },

    editItem: function () {
      var url = '#editListing/'+this.model.id;
            
      Backbone.history.navigate(url);
      Backbone.history.loadUrl(url);
    },

    buyItem: function(){  
      // Sets the listing open to false in the backbone model.
      // Instead of using a jquery put we use backbone but make
      // it all silent because we couldnt figure out how to make
      // a manual put request with data :')
      this.model.set({    
        listing_open: false
      },{
        silent: true
      });
      this.model.save(null,{silent:true});
    },

  });

  return ListingView;
});
