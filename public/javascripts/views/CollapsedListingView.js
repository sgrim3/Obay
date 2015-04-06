window.CollapsedListingView = Backbone.View.extend({
    tagname: "div",
    model: Listing,
    render: function (){
        console.log('inside collapsedlistingviews render func!');
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});
