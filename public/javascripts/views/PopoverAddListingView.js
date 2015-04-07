window.PopoverAddListingView = AddListingView.extend({
	events: {
	    'click #exitButton': 'broadcoastExitPopoverAddListing',
	    'click #postButton': 'postListing',
	},

    broadcoastExitPopoverAddListing: function(){
        Backbone.pubSub.trigger('exitPopoverAddListing');
    },

    broadcoastListingAdded: function(listingModel){
        //called when user makes a new listing from the Popover Add Listing
        Backbone.pubSub.trigger('listingAdded', listingModel);
    },

    destroyView: function() {
        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();
        this.$el.removeData().unbind(); 
        // Remove view from DOM
        this.remove();  
        Backbone.View.prototype.remove.call(this);
    },

    postListing: function(e) {
        var thisView = this;
        e.preventDefault();
    	var listing_name = $("#addListingName").val();
    	var listing_description = $("#addListingDescription").val();
    	var listing_image = $("#addListingImage").val();
        var listing_price= $("#addListingPrice").val();

        var new_listing = new Listing(
            {
                //listing_creator and listing_time_created is set on the server
                listing_name: listing_name,
                listing_description: listing_description,
                listing_image: listing_image,
                listing_open: true,
                listing_price: listing_price
            }
        );

        //this save function looks funny because it's not a mongoose save, it's a backbone models .save!
        new_listing.save({}, {
            success: function(model, response, options) {
                $('#error_message').text('');
                //associate server save time and user with the model
                model.listing_time_created = response.listing_time_created;
                model.listing_creator = response.listing_creator;
                thisView.broadcoastExitPopoverAddListing();
                thisView.broadcoastListingAdded(model);
            },
            error: function(model, response, options) {
                if (response.status === 401) {
                    //if not authenticated, redirect
                    if (!response.authenticated){
                        window.location.replace('/');
                    }
                } else {
                    $('#error_message').text(response.responseText);
                }
            }
        });

    }
});