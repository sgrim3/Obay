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
  'text!templates/ListingBuyerTemplate.html',
  'text!templates/ListingSellerTemplate.html',
  'text!templates/ListingViewerTemplate.html',
], function ($, _, Backbone, Listing, DestroyableView, PayView, 
  ListingBuyerTemplate, ListingSellerTemplate, ListingViewerTemplate) {
    var ListingView = DestroyableView.extend({
      tagname: "div",
      id: "ListingView",

    events: {   
      'click #buyButton': 'showPayView',  
      'click #editButton': 'editItem',  
    },

    initialize:function (info) {
      var _this = this;
      this.ListingBuyerTemplate = _.template(ListingBuyerTemplate);
      this.ListingSellerTemplate = _.template(ListingSellerTemplate);
      this.ListingViewerTemplate = _.template(ListingViewerTemplate);
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
      switch (window.userModel.attributes.userId) {
        // Seller.
        case this.model.attributes.listing_creator:
          console.log('1');
          this.$el.html(this.ListingSellerTemplate(this.model.attributes));
          break;
        // Buyer.
        case this.model.attributes.listing_buyer:
          console.log('2');
          this.$el.html(this.ListingBuyerTemplate(this.model.attributes));
          var payView = new PayView({
            model: _this.model,
            parentDiv: $('.pay-mount-point')
          });
          break;
        default:
          console.log('3');
          this.$el.html(this.ListingViewerTemplate(this.model.attributes));
          break;
      }
      return this;
    },

    editItem: function () {
      var url = '#editListing/'+this.model.id;
      Backbone.history.navigate(url);
      Backbone.history.loadUrl(url);
    },

    showPayView: function(){  
      console.log('buyitem called!');
      var _this = this;
      var payView = new PayView({
        model: _this.model,
        parentDiv: $('.pay-mount-point')
      });
      this.childViews.push(payView);
    },

  });

  return ListingView;
});
