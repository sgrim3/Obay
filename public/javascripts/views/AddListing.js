window.AddListingView = Backbone.View.extend({

    model:Listing,

	events: {
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

        var new_listing = new Listing(
            {
                //item_timeCreated is set on the server
                item_name: item_name,
                item_description: item_description,
                item_image: item_image,
                item_creator: item_creator,
                item_open: true
            }
        );

        new_listing.save({}, {
            success: function(model, response, options) {
                console.log('success');
                console.log(response);
            },
            error: function(model, xhr, options) {
                console.log('error');
                console.log(xhr);
            }
        });

    }

});
