define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/models/listing',

  'scripts/views/DestroyableView',
  'scripts/views/PayView',

  'text!templates/ListingView.html',
], function ($, _, Backbone, Listing, DestroyableView, PayView, listingTemplate) {

  var ListingView = DestroyableView.extend({
      tagname: "div",
      id: "ListingView",

  	events: {		
  	    'click #buyButton': 'buyItem',		
  	},

  	initialize:function (info) {
          this.childViews = [];
          this.model = info.model;
          this.template = _.template(listingTemplate);
      },

      render: function (info){
          info.parentDiv.append(this.$el);
          var listingView = this;
          this.model.fetch({
              success: function(listing){
                  listingView.$el.html(listingView.template(listing.attributes));
              },
              error: function(err){
                  console.log('Error loading object from server!');
              }
          });
          return listingView;
      },

      buyItem: function(){	
          console.log('buy item called!');
          var self = this;		
          //sets the listing open to false in the backbone model
          this.model.set({		
              listing_open: false		
          });		
          //saves backbone model and does PUT request to server
          console.log('dz About to save.');
          console.log(this.model);
          this.model.save(null, {
              success: function(listing){
                var payView = new PayView({el: $('#buyButton')});
                self.childViews.push(payView);
                payView.render({parentDiv: $('#buyButton')});
                //$("#buyButton").remove();
                // Backbone.history.navigate('#home');
                // Backbone.history.loadUrl('#home');
              },
              error: function(){
                  console.log('error buying item');
              }		
          });
      }
  });

  return ListingView;
});