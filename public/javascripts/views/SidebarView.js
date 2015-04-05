window.SidebarView = Backbone.View.extend({

    events: {
      'click .round-button': 'onClick',
    },

    initialize:function () {
        this.render();
    },

    render:function () {
        this.$el.html(this.template());
        return this;
    },

    onClick: function (ev){
      console.log(ev.currentTarget.id);
    },

});