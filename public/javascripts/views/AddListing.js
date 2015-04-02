window.AddListingView = Backbone.View.extend({

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
    	var item_name = $("#name").val();
    	var item_description = $("#description").val();
    	var item_creator = $("#creator").val();
    	var item_image = $("#image").val();
        var item_price= $("#price").val();

        var new_listing = new Listing(
            {
                //item_timeCreated is set on the server
                item_name: item_name,
                item_description: item_description,
                item_image: item_image,
                item_creator: item_creator,
                item_open: true,
                item_price: item_price
            }
        );

        new_listing.save({}, {
            success: function(model, response, options) {
                //associate server save time with the model
                model.item_timeCreated = response.item_timeCreated;
            },
            error: function(model, response, options) {
                console.log(response.responseText);
                /* redirect on no authentication, commented out for now.
                if (!response.authenticated){
                    window.location.replace('/');
                }*/
            }
        });

    }

});
