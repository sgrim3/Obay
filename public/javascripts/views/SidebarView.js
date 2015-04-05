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
      // console.log(ev.currentTarget.id);
      switch(ev.currentTarget.id) {
        case "homeButton":
          Backbone.history.loadUrl('#home');
          break;
        case "accountButton":
          console.log("accountButton");
          break;
        case "freeButton":
          console.log("freeButton");
          break;
        case "notificationsButton":
          console.log("notificationsButton");
          break;
        case "logoutButton":
          console.log("logoutButton");
          break;
        default:
          return;
      }
    },
});