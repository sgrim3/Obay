/*
Backbone feed  collection 
Is bound by sockets to mongoose model
*/


define([
  'underscore',
  'backbone',
  'scripts/models/listing',
], function (_, Backbone, Listing){

  var Feed = Backbone.Collection.extend({
    url : '/feed',
    model: Listing,

    comparator: function(model){
      //causes backbone to automatically sort by time on the client side.
      return model.get("listing_timeCreated");
    },
    
    initialize: function(info){
      if (info.criteria){
        this.criteria = info.criteria;
      } else {
        this.criteria = {};
      }
      var _this = this;
      window.socket.on('listing:create', this.createListing.bind(_this));
      window.socket.on('listing:update', this.updateListing.bind(_this));
      window.socket.on('listing:delete', this.deleteListing.bind(_this));
    },

    ListingFitsCriteria: function(listing){
      /*Checks if a listing fits the specified criteria and returns true or 
      false. This is not nearly as complex or good as mongodb's query operators, 
      but it will do basic matching.*/
      console.log(this.criteria);
      console.log(listing);
      console.log(_.where([listing],this.criteria));
      if (_.where([listing], this.criteria).length > 0){
        return true;
      } else {
        return false;
      }
    },

    createListing: function(model){
      console.log('socket listing:create');
      if (this.ListingFitsCriteria(model)){
        this.add(model);
      }
    },

    updateListing: function(model){
      console.log('socket listing:broadcast');
      var updated_model = this.get(model._id);
      updated_model.set(model);
    },

    deleteListing: function deleteListing(model) {
      console.log('socket listing:delete');
      var chosenListing = this.get(model._id);
      chosenListing.trigger('destroy', chosenListing, chosenListing.collection);
    },

    fetch: function(options){
      var _this = this;
      $.get(this.url, this.criteria)
        .success(function(data){
          if (options && options.reset){
            _this.reset(data);
          } else {
            _this.set(data);
          }
        })
        .error(function(data){
          console.log(data);
          console.log('Error fetching collection from server!');
        });
    },
  });
  return Feed;
});
