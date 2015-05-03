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
      console.log(this.model)
      var _this = this;

      this.template = _.template(ListingTemplate);
      info.parentDiv.append(this.$el);

      this.model.fetch({reset: true});
      this.listenTo(this.model, 'sync', this.render);
      /*this is what lets you update the model 
      with new info and listen for it */
      this.listenTo(this.model, 'change', this.render);
    },

    render: function (){
      document.getElementById("addButton").style.display="none";
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

    editItem: function () {
      var url = '#editListing/'+this.model.id;
            
      Backbone.history.navigate(url);
      Backbone.history.loadUrl(url);
    },

    buyItem: function(){  
      // Sets the listing open to false in the backbone model.
      console.log(this.model);
      this.model.set({    
        listing_open: false,
        listing_buyer: window.userModel.id   
      });

      console.log(this.model);

      // Saves backbone model and does PUT request to server.
      this.model.save(null, {
        success: function(listing){
          console.log("Successful!");
        },
        
        error: function(){
          console.log('SG|/public/views/ListingView.js|buyItem| error buying item');
        }
      });   
    }
  });

  return ListingView;
});
