define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/views/DestroyableView',
  'scripts/views/PopoverAddListingView',
  'text!templates/SidebarTemplate.html',
], function ($, _, Backbone, DestroyableView, 
  PopoverAddListingView, SidebarTemplate) {
  var SidebarView = DestroyableView.extend({
    tagname: "div",
    id: "SidebarView",

    events: {
      'click .round-button': 'onClick',
      'click .nav a': 'onNavClick',
    },

    initialize:function (info) {
      info.parentDiv.append(this.$el);
      this.listenTo(
        Backbone.pubSub, 
        'exitPopoverAddListing', 
        this.hidePopoverAddListing
      );
      this.template = _.template(SidebarTemplate);
      this.render();
    },

    render:function () {
      this.$el.html(this.template());
      return this;
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
          Backbone.history.navigate('#free');
          Backbone.history.loadUrl('#free');
          break;
        case "notificationsButton":
          //TODO- either delete this button or make it do something
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

    onNavClick: function onNavClick() {
      $(".btn-navbar").click(); //bootstrap 2.x
      $(".navbar-toggle").click(); //bootstrap 3.x by Richard
    },

    // TODO: Should this feature be here? It doesn't seem like the SidebarView
    // should be controlling the toggle feature of the popover.
    togglePopoverAddListing: function(){
      if (this.popoverAddListing) {
          this.hidePopoverAddListing();
      } else {
          this.showPopoverAddListing();
      }
    },

    showPopoverAddListing: function(){
      this.popoverAddListing = new PopoverAddListingView({
        parentDiv: $('#PopoverContainer')
      });
      this.urlBeforePop = Backbone.history.location.href;
      /*Purposely chose to use window.history here instead of 
      backbone.history because backbone.history seemed to be jumping 
      to the top of the page in certain weird cases.*/
      window.history.pushState({}, '', 'http://'+window.PORT+':3000/#addListing');  
    },

    hidePopoverAddListing: function(){
      this.popoverAddListing.destroy();
      this.popoverAddListing = null;
      window.history.pushState({}, '', this.urlBeforePop);
    },
  });
  return SidebarView;
});
