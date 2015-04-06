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
                    $('#image_upload').append("<button class='round-button' id='deleteImageButton'><i class='fa fa-times'></i></button>");
                    var this_dropzone = this;
                    $('#deleteImageButton').click(function(event) {
                        this_dropzone.removeAllFiles(true);
                        $('#deleteImageButton').remove();
                        $('#image').val('');
                    });
                });
                this.on("success", function(file, response) {
                    $('#image').val(response);
                });
            }
        };
        this.image_upload = new Dropzone($('#image_upload').get(0), dropzone_options);
        this_dropzone = this.image_upload;
        console.log($('.dz-image'));
        $('.dz-image').click(function(event) {
            console.log('image clicked');
            this_dropzone.removeAllFiles(true);
        });
        return this;
    },

    onFormSubmit: function(e) {
        e.preventDefault();
        console.log(this.image_upload);
    	var listing_name = $("#name").val();
    	var listing_description = $("#description").val();
    	var listing_image = $("#image").val();
        var listing_price= $("#price").val();

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
                Backbone.history.navigate('#home');
                Backbone.history.loadUrl('#home');
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
