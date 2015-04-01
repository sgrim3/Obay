// TittlesView is executed when you go to the home page
// which renders the titleTemplate from index.html
// TittlesView is created in router.js in "home", which is triggered 
// when "" url parameter is called.

var app = app || {};

app.TitlesView = Backbone.View.extend({
	el: '#titles',

	initialize: function(initialPages) {
		this.collection = new app.Pages(initialPages);
		this.collection.fetch();
		this.render();
		this.listenTo(this.collection, 'add', this.renderTitle);
	},

	render: function() {
		this.collection.each(function(item) {
			this.renderTitle(item);
		}, this);
	},

	renderTitle: function(item) {
		var titleView = new app.TitleView({
			model: item,
			collection: this.collection
		});
		this.$el.append(titleView.render().el);
	}
});