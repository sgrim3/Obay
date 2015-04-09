window.SidebarView = DestroyableView.extend({
    tagname: "div",
    id: "SidebarView",

    events: {
      'click .round-button': 'onClick',
    },

    initialize:function () {
        this.childViews = [];
        //toss in global event listeners
        this.listenTo(Backbone.pubSub, 'exitPopoverAddListing', this.hidePopoverAddListing);
    },

    render:function (info) {
        info.parentDiv.append(this.$el);
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
      switch(ev.currentTarget.id) {
        case "homeButton":
          Backbone.history.navigate('#home');
          Backbone.history.loadUrl('#home');
          break;
        case "accountButton":
          Backbone.history.navigate('#account');
          Backbone.history.loadUrl('#account');
          break;
        case "freeButton":
          Backbone.history.navigate('#home/free');
          Backbone.history.loadUrl('#home/free');
          break;
        case "notificationsButton":
          console.log("notificationsButton");
          break;
        case "logoutButton":
          Backbone.history.navigate('#logout');
          Backbone.history.loadUrl('#logout');
          break;
        case "addButton":
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
        this.popoverAddListing = new PopoverAddListingView();
        this.popoverAddListing.render({parentDiv: $('#PopoverContainer')});
        this.urlBeforePop = Backbone.history.location.href;
        //purposely chose to use window.history here instead of backbone.history because backbone.history seemed to be jumping to the top of the page in certain weird cases.
        window.history.pushState({}, '', 'http://127.0.0.1:3000/#addListing');
    },

    hidePopoverAddListing: function(){
        $('#popoverMask').remove();
        this.popoverAddListing.destroy();
        this.popoverAddListing = null;
        window.history.pushState({}, '', this.urlBeforePop);
    },

});
