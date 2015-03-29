// url parameters are mapped to functions that are triggered when a url parameter is requested 

var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'create': 'create',
		'page/:id': 'page',
		'page/:id/edit': 'edit'
	},

	home: function() {
		new app.TitlesView();
	},

	create: function () {
		$("#titles").empty();
		new app.CreateView();
	},

	page: function (id) {
		$("#titles").empty();
		new app.PageView(id);
	},

	edit: function (id) {
		$("#content").empty();
		new app.EditView(id);
	}
});

app.Router = new Router();
Backbone.history.start();