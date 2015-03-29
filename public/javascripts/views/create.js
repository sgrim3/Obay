//javascripts/views/create.js

// CreateView is executed when the create button is pushed to create 
// a new page and renders the createTemplate from index.html
// CreateView is created in router.js in "create", which is triggered 
// when "create" url parameter is called.

var app = app || {};

app.CreateView = Backbone.View.extend({
	el: "#create",
	template: _.template($('#createTemplate').html()),

	events: {
		'click #submit': 'createPage'
	},

	initialize: function() {
		this.collection = new app.Pages();
		this.collection.fetch({});
		this.render();
	},

	render: function() {
		this.$el.html(this.template);
		return this;
	},

	createPage: function (e) {
		e.preventDefault();
		var formData = {};

		$( '#createPage div' ).children( 'input' ).each( function( i, el ) {
	        if( $( el ).val() != '' ) {
	            formData[ el.id ] = $( el ).val();
	        }
	    });
	    $( '#createPage div' ).children( 'textarea' ).each( function( i, el ) {
	        if( $( el ).val() != '' ) {
	            formData[ el.id ] = $( el ).val();
	        }
	    });

	    this.collection.create(formData, {
	    	success: function (res) {
	    		console.log('Success!');
	    		console.log(res);
	    	}
	    });
	}	
});