var app = app || {};

app.Listings = Backbone.Collection.extend({
	url: '/listings',
    model: app.Listing
});