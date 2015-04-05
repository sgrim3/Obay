window.HomeView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function() {
        //must instantiate template before rendering subviews, since they mount onto the template!
        this.$el.html(this.template());
        console.log('rendering listingsview');
        this.ListingsView = new ListingsView({el: $('#listings_view_mount_point')});
        this.ListingsView.render();

        // this.ItemView = new ItemView({el: $('#item_view_mount_point')});
        // this.ItemView.render();
        return this;
    }

});
