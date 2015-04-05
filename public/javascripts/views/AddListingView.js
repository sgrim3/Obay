window.AddListingView = Backbone.View.extend({

	events: {
	    'submit': 'onFormSubmit',
	},

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        var dropzone_options = {
            dictDefaultMessage: 'Drag file here or click to upload to Imgur! (Automatically populates Image url)',
            url: "/image",
            init: function() {
                this.on("addedfile", function() {
                    if (this.files[1]!=null){
                        this.removeFile(this.files[0]);
                    }
                });
                this.on("success", function(file, response) {
                    $('#image').val(response);
                    console.log(response);
                });
            }
        };
        this.image_upload = new Dropzone($('#image_upload').get(0), dropzone_options);
        return this;
    },

    onFormSubmit: function(e) {
        e.preventDefault();
        console.log(this.image_upload);
    	var item_name = $("#name").val();
    	var item_description = $("#description").val();
    	var item_image = $("#image").val();
        var item_price= $("#price").val();

        var new_listing = new Listing(
            {
                //item_creator and item_timeCreated is set on the server
                item_name: item_name,
                item_description: item_description,
                item_image: item_image,
                item_open: true,
                item_price: item_price
            }
        );

        //this save function looks funny because it's not a mongoose save, it's a backbone models .save!
        new_listing.save({}, {
            success: function(model, response, options) {
                $('#error_message').text('');
                //associate server save time and user with the model
                model.item_timeCreated = response.item_timeCreated;
                model.item_creator = response.item_creator;
                console.log(model)
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
