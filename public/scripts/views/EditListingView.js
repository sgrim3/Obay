define([
  'jquery', 
  'underscore', 
  'backbone',
  'dropzone',

  'scripts/models/listing',

  'scripts/views/DestroyableView',
    'scripts/views/AddListingView',

  'text!templates/AddListingTemplate.html'
], function ($, _, Backbone, Dropzone, Listing, DestroyableView, AddListingView, AddListingTemplate) {
    var EditListingView = AddListingView.extend({
        tagname: "div",
        id: "AddListingView",

        events: {
            'click #postButton': 'updateListing',
        },

        initialize: function(info){
            this.model = info.model;
            this.template = _.template(AddListingTemplate);
        },


        render:function (info) {

            var self = this;
            this.model.fetch({
                success: function(listing){
                    console.log(listing.attributes);
                    info.parentDiv.append(self.$el);
                    $(self.el).html(self.template(listing.attributes));
                    var dropzone_options = {
                        dictDefaultMessage: 'Drag file here or click to upload to Imgur! (Automatically populates Image url)',
                        url: "/image",
                        init: function() {
                            self.on("addedfile", function() {
                                if (self.files[1]!=null){
                                    self.removeFile(self.files[0]);
                                }
                                $('#image_upload').append("<button class='round-button' id='deleteImageButton'><i class='fa fa-times'></i></button>");
                                var this_dropzone = self;
                                $('#deleteImageButton').click(function(event) {
                                    this_dropzone.removeAllFiles(true);
                                    $('#deleteImageButton').remove();
                                    $('#addListingImage').val('');
                                });
                            });
                            self.on("success", function(file, response) {
                                $('#addListingImage').val(response);
                            });
                        }
                    };
                    self.image_upload = new Dropzone($('#image_upload').get(0), dropzone_options);
                    this_dropzone = self.image_upload;
                    $('.dz-image').click(function(event) {
                        this_dropzone.removeAllFiles(true);
                    });
                },
                error: function(err){
                    console.log("error loading object from server");
                }
            });
            return self;
        },

        updateListing: function(e) {
            e.preventDefault();
            // console.log(this.model);
            // var id = this.model.id;
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

            

            //this save function looks funny because it's not a mongoose save, it's a backbone models .save!
            this.model.save({}, {
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

    return EditListingView;
});
