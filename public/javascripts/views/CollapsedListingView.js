window.CollapsedListingView = Backbone.View.extend({
    tagname: "div",
    model: Listing,
    getThumbnailUrl: function(url){
        return url.substring(0,url.length-4)+'m'+url.substring(url.length-4,url.length);
    },
    render: function (){
        var listing_attrs = this.model.attributes;
        listing_attrs.listing_thumbnail = this.getThumbnailUrl(listing_attrs.listing_image);
        this.$el.html(this.template(listing_attrs));
        return this;
    }
});