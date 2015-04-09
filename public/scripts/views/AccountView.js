window.AccountView = DestroyableView.extend({
    tagname: "div",
    id: "AccountView",

    render:function (info) {
        info.parentDiv.append(this.$el);
        this.$el.html(this.template());
        return this;
    }

});
