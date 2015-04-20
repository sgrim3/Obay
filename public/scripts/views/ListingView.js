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
      this.model = info.model;
      this.template = _.template(ListingTemplate);
      info.parentDiv.append(this.$el);

      this.model.fetch({reset: true});
      this.listenTo(this.model, 'sync', this.render);
    },

    render: function (){

      var currentUser = this.model.attributes.currentUser;
      var itemCreator = this.model.attributes.model_creator;
      this.$el.html(this.template(this.model.attributes));
      
      return this;
    },

    editItem: function () {
      var url = '#editListing/'+this.model.id;
            
      Backbone.history.navigate(url);
      Backbone.history.loadUrl(url);
    },

    buyItem: function(){  
          
      var _this = this;    
      
      // Sets the listing open to false in the backbone model.
      this.model.set({    
        listing_open: false   
      });   
      
      // Saves backbone model and does PUT request to server.
      // TODO: Change this so that it follows event decoupled convention.
      var _this = this;
      this.model.save(null, {
        success: function(listing){
          var payView = new PayView({
            model:_this.model, 
            parentDiv: $('#buyButton')
          });

          _this.childViews.push(payView);
          // $("#buyButton").remove();
          // Backbone.history.navigate('#home');
          // Backbone.history.loadUrl('#home');
        },
        
        error: function(){
          console.log('SG|/public/views/ListingView.js|buyItem| error buying item');
        }

      });
    }
  });

  return ListingView;
});
