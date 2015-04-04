window.Listings = Backbone.Collection.extend({
    model: Listing,
    urlRoot : "http://127.0.0.1:3000/listings/"
});
