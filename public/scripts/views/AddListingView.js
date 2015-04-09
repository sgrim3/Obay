define([
  'jquery', 
  'underscore', 
  'Backbone',
], function ($, _, Backbone) {

  var AddListingView = Backbone.View.extend({

    events: {
      'click #postButton': 'postListing',
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
              $('#addListingImage').val('');
            });
          });
          this.on("success", function(file, response) {
            $('#addListingImage').val(response);
          });
        }
      };
      this.image_upload = new Dropzone($('#image_upload').get(0), dropzone_options);
      this_dropzone = this.image_upload;
      $('.dz-image').click(function(event) {
        this_dropzone.removeAllFiles(true);
      });
      return this;
    },

    postListing: function(e) {
      console.log("dz AddListingView postListing");
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

  return AddListingView;
});