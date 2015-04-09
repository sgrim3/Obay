window.HomeView = DestroyableView.extend({
    tagname: "div",
    id: "HomeView",

    render:function(info) {
        //must instantiate template before rendering subviews, since they mount onto the template!
        info.parentDiv.append(this.$el);
        this.$el.html(this.template());
        var feedView = new FeedView( {feedModel: new Feed()} );
        this.childViews.push(feedView);
        feedView.render( {parentDiv: $('#FeedViewMountPoint')} );
        return this;
    },

});
