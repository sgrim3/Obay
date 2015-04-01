window.AddListingView = Backbone.View.extend({

	events: function () {
		'submit': 'onFormSubmit',
	},

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },

    onFormSubmit: function(e) {
		e.preventDefault();
    	
    	var item_name = $("#name").val()
    	var item_description = $("#description").val()
    	var item_creator = $("#creator").val()
    	var item_image = $("#image").val()

    	var self = this;

    	this.model.save (null, {
            success: function (model) {
                self.render();
                alert ("Listing has been saved!")
                //app.navigate('listings/' + listing.id, false);
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });

    },

});
