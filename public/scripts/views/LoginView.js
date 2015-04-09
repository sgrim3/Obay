window.LoginView = DestroyableView.extend({
    tagname: "div",
    id: "LoginView",

    render:function (info) {
        info.parentDiv.append(this.$el);
        this.$el.html(this.template());
        return this;
    }

});
