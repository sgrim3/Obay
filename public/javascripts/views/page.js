//javascripts/views/page.js

// PageView is executed when you click on one of the titles in home page
// which renders the contentTemplate from index.html
// PageView is created in router.js in "page", which is triggered 
// when "page/:id" url parameter is called.

var app = app || {};

app.PageView = Backbone.View.extend({
	el: '#content',
	tagName: 'div',
	className: 'contentContainer',
	template: _.template($('#contentTemplate').html()),

	events: {
		'click .delete': 'deletePage'
	},

	initialize: function(id) {
		var that = this;
		this.model = new app.Page(id);
		this.model.fetch({
			success: function (page) {
				that.render();
			}
		});
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	deletePage: function() {
		this.model.destroy(); // Delete the model
		this.remove(); // Remove view
	}
});