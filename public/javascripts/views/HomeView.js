window.HomeView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function() {
        //must instantiate template before rendering subviews, since they mount onto the template!
        this.$el.html(this.template());
        this.FeedView = new FeedView({el: $('#feed_view_mount_point')});
        
        return this;
    }

});
