window.Listing = Backbone.Model.extend({
    defaults: {
        item_name: '',
        item_description: '',
        item_image: '',
        item_creator: '',
        item_timeCreated: 0,
        item_open: True
    },

    initialize: function (id) {
        this.urlRoot = "/listing/";
    },

    parse: function( res ) {
        console.log(res._id)
        res.id = res._id;
        return res;
    }

});
