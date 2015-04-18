define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/models/listing',
  'scripts/views/DestroyableView',
  'text!templates/CollapsedListingTemplate.html'
], function ($, _, Backbone, Listing, DestroyableView, CollapsedListingTemplate) {
    var CollapsedListingView = DestroyableView.extend({
        tagname: "div",
        id: "CollapsedListingView",
        // model: Listing,

        initialize: function(data){
            data.parentDiv.prepend(this.$el);
            this.template = _.template(CollapsedListingTemplate);
            this.model = data.model
            this.listenTo(this.model, 'change', this.render);
            this.render();
            // collapsedListingView.render({parentDiv: _this.$el});
        },

        getThumbnailUrl: function(url){
            if (this.isImgurLink(url)){
                return url.substring(0,url.length-4)+'b'+url.substring(url.length-4,url.length);
            } else {
                return url;
            }
        },

        isImgurLink: function(url){
            if (url.match(/^(http:\/\/)?(i\.imgur\.com)/)){
                //code intentionally written this way and is NOT redundant. Takes advantage of javascript's 'truthiness', where null is false and non-empty values are true. Could use ternary operator if ya really want a one liner
                return true;
            } else {
                return false;
            }
        },

        render: function (){
            var listing_attrs = this.model.attributes;
            listing_attrs.listing_thumbnail = this.getThumbnailUrl(listing_attrs.listing_image);
            this.$el.html(this.template(listing_attrs));
            return this;
        }
    });

    return CollapsedListingView;
});
