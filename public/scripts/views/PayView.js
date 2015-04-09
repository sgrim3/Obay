window.PayView = DestroyableView.extend({
  tagname: "div",
  id: "PayView",
  render: function (info){
    info.parentDiv.append(this.$el);
    this.$el.html(this.template());
    return this;
  },
});
