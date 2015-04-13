define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/models/listing',

  'scripts/views/DestroyableView',
  'scripts/views/PayView',

  'text!templates/ListingTemplate.html',
], function ($, _, Backbone, Listing, DestroyableView, PayView, ListingTemplate) {

  var ListingView = DestroyableView.extend({
      tagname: "div",
      id: "ListingView",

  	events: {		
  	    'click #buyButton': 'buyItem',	
        'click #editButton': 'editItem',	
  	},

  	initialize:function (info) {
          this.model = info.model;
          this.template = _.template(ListingTemplate);
      },

      render: function (info){
          info.parentDiv.append(this.$el);
          var listingView = this;
          this.model.fetch({
              success: function(listing){
                  var currentUser = listing.attributes.currentUser;
                  var itemCreator = listing.attributes.listing_creator;

                  listingView.$el.html(listingView.template(listing.attributes));
              },
              error: function(err){
                  console.log('Error loading object from server!');
              }
          });
          return listingView;
      },

      editItem: function () {
        var url = '#editListing/'+this.model.id;
        console.log(url);
            Backbone.history.navigate(url);
            Backbone.history.loadUrl(url);

      },

      buyItem: function(){	
          console.log('buy item called!');
          var self = this;		
          //sets the listing open to false in the backbone model
          this.model.set({		
              listing_open: false		
          });		
          //saves backbone model and does PUT request to server
          var self = this;
          this.model.save(null, {
              success: function(listing){
                var payView = new PayView({model:self.model});
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
