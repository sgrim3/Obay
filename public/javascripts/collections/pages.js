// public/javascripts/collections/pages.js

var app = app || {};

app.Pages = Backbone.Collection.extend({
	url: '/pages',
    model: app.Page
});