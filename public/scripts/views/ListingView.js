define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/models/listing',

  'text!templates/ListingView.html',
], function ($, _, Backbone, Listing, listingTemplate) {
  var ListingView = Backbone.View.extend({

    events: {   
      'click #buyButton': 'buyItem',
      'click #exitButton': 'exitItem',      
    },

    initialize:function (options) {
      console.log('dz ListingView initialize');
      this.template = _.template(listingTemplate);
      this.render(options);
    },

    render: function(options){
      console.log(options.id);
      if (options.id) {
        this.model = new Listing({id:options.id});
        var listingView = this;
        this.model.fetch({
          success: function(listing){
            listingView.$el.html(listingView.template(listing.attributes));
            return listingView;
          },
          error: function(err){
            console.log('Error loading object from server!');
          }
        });
      }
      else{
        console.log('no object to look for');
      }
    },

    buyItem: function(options){ 
      if(this.id){  
        this.model = new Listing({id:this.id});   
        var listingView = this;   
        
        //sets the listing open to false in the backbone model
        this.model.set({    
          listing_open: false   
        });   
        
        //saves backbone model and does PUT request to server
        this.model.save({
          success: function(listing){
            console.log(listing.attributes);
          },
          error: function(){
            console.log('error buying item');
          }   
        });

        //TODO: will eventually show success message
        // Create a new view.
        var payView = new PayView({el: $('#buyButton')});
        $("#buyButton").replaceWith(payView.template());

        // Backbone.history.navigate('#home');
        // Backbone.history.loadUrl('#home');
      }

      else{
        alert("Error buying item. Please try re-logging in and refreshing page.");
      }
    }, 

    exitItem: function (options){
      // COMPLETELY UNBIND THE VIEW
      // this.undelegateEvents();
      // this.$el.removeData().unbind(); 
      // Remove view from DOM
      // this.remove();
      // Backbone.View.prototype.remove.call(this);

      this.unbind(); // Unbind all local event bindings

      // this.remove(); // Remove view from DOM
     
      // console.log(this.$el);
      this.$el.removeData(); // Delete the jQuery wrapped object variable
      delete this.el; // Delete the variable reference to this node
       
    } 
  });

  return ListingView;
});