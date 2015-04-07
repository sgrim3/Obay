window.SidebarView = Backbone.View.extend({

    events: {
      'click .round-button': 'onClick',
    },

    initialize:function () {
        //toss in global event listeners
        this.listenTo(Backbone.pubSub, 'exitPopoverAddListing', this.hidePopoverAddListing);
        this.render();
    },

    render:function () {
        this.$el.html(this.template());
        return this;
    },

    destroyView: function() {
        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();
        this.$el.removeData().unbind(); 
        // Remove view from DOM
        this.remove();  
        Backbone.View.prototype.remove.call(this);
    },

    onClick: function (ev){
      // console.log(ev.currentTarget.id);
      switch(ev.currentTarget.id) {
        case "homeButton":
          Backbone.history.navigate('#home');
          Backbone.history.loadUrl('#home');
          break;
        case "accountButton":
          console.log("accountButton");
          Backbone.history.navigate('#account');
          Backbone.history.loadUrl('#account');
          break;
        case "freeButton":
          console.log("freeButton");
          break;
        case "notificationsButton":
          console.log("notificationsButton");
          break;
        case "logoutButton":
          Backbone.history.navigate('#logout');
          Backbone.history.loadUrl('#logout');
          break;
        case "addButton":
          // FIXME: This is such a messy way of doing things. Find a better way.
          //Backbone.history.navigate('#addListing');
          //Backbone.history.loadUrl('#addListing');
          this.togglePopoverAddListing();
          break;
        default:
          return;
      }
    },

    togglePopoverAddListing: function(){
        if (this.popoverAddListing) {
            this.hidePopoverAddListing();
        } else {
            this.showPopoverAddListing();
        }
    },

    showPopoverAddListing: function(){
        $('#PageContainer').append("<div id='popoverMask'></div>");
        //create mountpoint for the popover
        $('#popoverMask').append("<div id='popoverAddListing'></div>");
        this.popoverAddListing = new PopoverAddListingView({el: $('#popoverAddListing')});
        this.urlBeforePop = Backbone.history.location.href;
        //purposely chose to use window.history here instead of backbone.history because backbone.history seemed to be jumping to the top of the page in certain weird cases.
        window.history.pushState({}, '', 'http://127.0.0.1:3000/#addListing');
    },

    hidePopoverAddListing: function(){
        $('#popoverMask').remove();
        this.popoverAddListing.destroyView();
        this.popoverAddListing = null;
        window.history.pushState({}, '', this.urlBeforePop);
    },

});
