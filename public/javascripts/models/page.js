var app = app || {};

app.Page = Backbone.Model.extend({

	defaults: {
		title: '',
		content: ''
	},

    initialize: function (id) {
    	this.urlRoot = "page/" + id;
    },

    parse: function( res ) {
    	console.log(res._id)
	    res.id = res._id;
	    return res;
	}
})