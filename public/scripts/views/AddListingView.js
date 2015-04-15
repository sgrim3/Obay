define([
  'jquery', 
  'underscore', 
  'backbone',
  'dropzone',

  'scripts/models/listing',

  'scripts/views/DestroyableView',

  'text!templates/AddListingTemplate.html'
], function ($, _, Backbone, Dropzone, Listing, DestroyableView, AddListingTemplate) {
    var AddListingView = DestroyableView.extend({
        tagname: "div",
        id: "AddListingView",

    	events: {
    	    'click #postButton': 'postListing'
    	},

        initialize: function (){
            this.template = _.template(AddListingTemplate);
        },

        destroy:function () {
            //This is rewritten so that dropzone instances are automatically destroyed!
            //destroy dropzone instance to prevent memory leaks
            Dropzone.instances = _.without(Dropzone.instances, this.image_upload);
            //destroys view and corresponding mount point /$el
            this.childViews.forEach( function (childView) {
                //destroy all child views!
                childView.destroy();
            });
            // COMPLETELY UNBIND THE VIEW
            this.undelegateEvents();
            this.$el.removeData().unbind(); 
            // Remove view from DOM
            this.remove();  
            Backbone.View.prototype.remove.call(this);
            return this;
        },

        render:function (info) {
            info.parentDiv.append(this.$el);
            var listing_attributes={
                listing_name:'',
                listing_price:'',
                listing_description:'',
                listing_image:''
            }
            $(this.el).html(this.template(listing_attributes));
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

        broadcastFeedAddListing: function(broadcastObj){
          //broadcasts to feed collections and tells them to add a model and sync with the server
          Backbone.pubSub.trigger('feedAddListing', broadcastObj);
        },

        getModelInfoAndextraData: function(){
          //returns obj containing extra arguments and model info like so: {extraData:{},modelInfo:{}}
            var listing_name = $("#addListingName").val();
            var listing_description = $("#addListingDescription").val();
            var listing_image = $("#addListingImage").val();
            var listing_price = $("#addListingPrice").val();
            var toCarpe = $("#carpeButton:checked").val();
            var modelInfo = {
              listing_name: listing_name,
              listing_description: listing_description,
              listing_image: listing_image,
              listing_open: true,
              listing_price: listing_price
            };
            var extraData = {toCarpe:toCarpe};
            return {extraData:extraData, modelInfo:modelInfo};
        },

        postHelper: function(callbacks){
          var broadcastObj = this.getModelInfoAndextraData();
          broadcastObj.callbacks = callbacks;
          this.broadcastFeedAddListing(broadcastObj);
        },

        postListing: function(event){
          event.preventDefault();
          var callbacks = {
            success: function(model, response, options) {
                $('#error_message').text('');
                Backbone.history.navigate('#home');
                Backbone.history.loadUrl('#home');
            },
            error: function(model, response, options) {
                if (response.status === 401) {
                    if (!response.authenticated){
                        window.location.replace('/');
                    }
                } else {
                    $('#error_message').text(response.responseText);
                }
            }
          };
          this.postHelper(callbacks)
        },

    });

    return AddListingView;
});
