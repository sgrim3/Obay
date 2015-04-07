window.CollapsedListingView = Backbone.View.extend({
    tagname: "div",
    model: Listing,
    render: function (){
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});
