/*
Backbone view to edit an item
Extends from DestroyableView
Updates the listing
*/

define([
  'jquery', 
  'underscore', 
  'backbone',
  'dropzone',

  'scripts/models/listing',

  'scripts/views/DestroyableView',
  'scripts/views/AddListingView',

  'text!templates/AddListingTemplate.html',

  'cropper'
], function ($, _, Backbone, Dropzone, Listing, 
  DestroyableView, AddListingView, AddListingTemplate) {
  var EditListingView = AddListingView.extend({
    tagname: "div",
    id: "AddListingView",

    events: {
      'click #postButton': 'updateListing',
    },

    initialize: function(info){
      this.template = _.template(AddListingTemplate);
      info.parentDiv.append(this.$el);

      this.model = info.model;
      this.model.fetch({reset: true});

      this.listenTo(this.model, 'sync', this.render);
    },

    render:function () {
      document.getElementById("addButton").style.display="none";

      $(this.el).html(this.template(this.model.attributes));
      
      var dropzone_options = {
        dictDefaultMessage: 'Drag file here or click to upload to Imgur! ' 
        + '(Automatically populates Image url)',
        url: "/image",
        init: function() {
          this.on("addedfile", function() {
            if (this.files[1]!=null){
              this.removeFile(this.files[0]);
            }
            $('#image_upload').cropper({
              aspectRatio: 1 / 1,
              crop: function(data) {
                console.log("Hello!");
                console.log(data);

                $('#image_upload').append("<button class='round-button' "
                  + "id='deleteImageButton'><i class='fa fa-times'></i>" 
                  + "</button>");
                var this_dropzone = this;
                $('#deleteImageButton').click(function(event) {
                  this_dropzone.removeAllFiles(true);
                  $('#deleteImageButton').remove();
                  $('#addListingImage').val('');
                });
              }
            });
          });
          this.on("success", function(file, response) {
            $('#addListingImage').val(response);
          });
        }
      };

      this.image_upload = new Dropzone($('#image_upload').get(0), 
        dropzone_options);
      this_dropzone = this.image_upload;
      $('.dz-image').click(function(event) {
        this_dropzone.removeAllFiles(true);
      });

      return this;
    },

    // TODO: Potentially refactor. Not sure what's the best way for this yet.
    updateListing: function(e) {
      e.preventDefault();
      var listing_name = $("#addListingName").val();
      var listing_description = $("#addListingDescription").val();
      var listing_image = $("#addListingImage").val();
      var listing_price= $("#addListingPrice").val();

      this.model.set({ 
        listing_name: listing_name,
        listing_description: listing_description,
        listing_image: listing_image,
        listing_open: true,
        listing_price: listing_price    
      });   

      /*This save function looks funny because it's not a mongoose save, 
      it's a backbone models .save!*/
      this.model.save({}, {
        success: function(model, response, options) {
          $('#error_message').text('');
          // Associate server save time and user with the model.
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

  return EditListingView;
});
