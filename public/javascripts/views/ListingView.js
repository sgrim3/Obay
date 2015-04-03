var ListingView = Backbone.View.extend({
    tagname: "div",
    model: Listing,
    render: function (){
        console.log(this.model.attributes);
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});
