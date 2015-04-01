//javascripts/views/title.js

// TitleView is for viewing a single title of a page 
// on the home page 

var app = app || {};

app.TitleView = Backbone.View.extend({
	tagName: 'div', 
	className: 'titleContainer',
	template: _.template($('#titleTemplate').html()),

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}
});