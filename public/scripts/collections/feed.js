define([
  'underscore',
  'backbone',
  'scripts/models/listing',
], function (_, Backbone, Listing){

  var Feed = Backbone.Collection.extend({
    url : '/feed',
    model: Listing,
    
    initialize: function(info){
      if (info.criteria){
        this.criteria = info.criteria;
      } else {
        this.criteria = {};
      }
      this.fetch({reset: true});
      var _this = this;
      window.socket.on('listing:create', this.createListing.bind(_this));
      window.socket.on('listing:update', this.updateListing.bind(_this));
    },

    ListingFitsCriteria: function(listing){
      //checks if a listing fits the specified criteria and returns true or false. This is not nearly as complex or good as mongodb's query operators, but it will do basic matching.
      if (_.where([listing], this.criteria).length > 0){
        return true;
      } else {
        return false;
      }
    },

    createListing: function(model){
      if (this.ListingFitsCriteria(model)){
        this.add(model);
      }
    },

    updateListing: function(model){
      var updated_model = this.get(model._id);
      updated_model.set(model);
    },

    fetch: function(){
      var _this = this;
      $.get(_this.url,_this.criteria)
        .success(function(data){
          _this.reset(data);
        })
        .error(function(data){
          console.log(data);
          console.log('Error fetching collection from servar!');
        });
    },

  });
  return Feed;
});
