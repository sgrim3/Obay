define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/models/listing',

  'scripts/views/DestroyableView',

  'text!templates/CollapsedListingView.html'
], function ($, _, Backbone, Listing, DestroyableView, CollapsedListingTemplate) {
    var CollapsedListingView = DestroyableView.extend({
        tagname: "div",
        id: "CollapsedListingView",
        model: Listing,
        getThumbnailUrl: function(url){
            if (this.isImgurLink(url)){
                return url.substring(0,url.length-4)+'b'+url.substring(url.length-4,url.length);
            } else {
                return url;
            }
        },
        isImgurLink: function(url){
            if (url.match(/^(http:\/\/)?(i\.imgur\.com)/)){
                //code intentionally written this way and is NOT redundant. Takes advantage of javascript's 'truthiness', where null is false and non-empty values are true.
                return true;
            } else {
                return false;
            }
        },
        render: function (info){
            this.template = _.template(CollapsedListingTemplate);
            info.parentDiv.append(this.$el);
            var listing_attrs = this.model.attributes;
            listing_attrs.listing_thumbnail = this.getThumbnailUrl(listing_attrs.listing_image);
            this.$el.html(this.template(listing_attrs));
            return this;
        }
    });

    return CollapsedListingView;
});