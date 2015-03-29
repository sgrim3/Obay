//javascripts/views/edit.js

// EditView is executed when the edit button is pushed to edit an existing
// page and renders the editTemplate from index.html
// EditView is created in router.js in "edit", which is triggered 
// when "page/:id/edit" url parameter is called.

var app = app || {};

app.EditView = Backbone.View.extend({
	el: "#edit",
	template: _.template($('#editTemplate').html()),

	events: {
		'click #submit': 'editPage'
	},

	initialize: function(id) {
		this.model = new app.Page(id);
		this.model.fetch();
		this.render();
	},

	render: function() {
		// sending previous attributes, rather than attributes (?)
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	editPage: function (e) {
		e.preventDefault();
		var formData = {};

		$( '#editPage div' ).children( 'input' ).each( function( i, el ) {
	        if( $( el ).val() != '' ) {
	            formData[ el.id ] = $( el ).val();
	        }
	    });
	    $( '#editPage div' ).children( 'textarea' ).each( function( i, el ) {
	        if( $( el ).val() != '' ) {
	            formData[ el.id ] = $( el ).val();
	        }
	    });

	    this.model.save(formData);
	}	
});