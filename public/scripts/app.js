// Configure external dependencies.
requirejs.config({
  baseUrl: "",
  paths: {
    jquery: "scripts/libs/jquery/dist/jquery",
    underscore: "scripts/libs/underscore/underscore",
    backbone: "scripts/libs/backbone/backbone",
    text: "scripts/libs/text/text",
    dropzone: "scripts/libs/dropzone",
    utils: "scripts/utils"
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'backbone'
    },
    'underscore': {
      exports: 'underscore'
    },
  }
});

require([
  'jquery',
  'backbone',
  'utils',
  // TODO: Refactor so that router doesn't handle everything.
  'scripts/models/listing',
  'scripts/models/user',
  'scripts/collections/feed',
  'scripts/collections/freeFeed',

  'scripts/views/AccountView',
  'scripts/views/AddListingView',
  'scripts/views/CollapsedListingView',
  'scripts/views/FeedView',
  'scripts/views/HomeView',
  'scripts/views/ListingView',
  'scripts/views/LoginView',
  'scripts/views/NotFoundView',
  'scripts/views/PayView',
  'scripts/views/PopoverAddListingView',
  'scripts/views/SidebarView',
  'scripts/views/SortFreeHomeView'
], function(
  $,
  Backbone,
  utils,

  ListingModel,
  UserModel,
  FeedCollection,
  FreeFeedCollection,

  AccountView,
  AddListingView,
  CollapsedListingView,
  FeedView,
  HomeView,
  ListingView,
  LoginView,
  NotFoundView,
  PayView,
  PopoverAddListingView,
  SidebarView,
  SortFreeHomeView
){
  var Router = Backbone.Router.extend({
    routes: {
      "": "login",
      "logout": "logout",
      "home": "home",
      "home/free":"free",
      "account": "account",
      "listing/:id" : "listing",
      "addListing": "addListing",
      "temporaryPayRoute": "pay",
      '*notFound': 'notFound' // This route must go last to act as the catchall/404 page.
    },

    login: function(id){
      var onOlinAuth = function(){
        //redirect to home if user is logged in already
        window.location.replace('/#home');
      }
      var onOlinErr = function(){
        this.Page = new LoginView({el: $('#PageContainer')});
      }
      utils.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    logout: function (id){
      console.log("Logging out.");
      $.post('/logout')
        .done(function (){
            Backbone.history.navigate("", true);
            window.Sidebar.destroyView(); // FIXME: This is a hack.
        })
        .error(function(){
            console.log("Failed to log out.");
        });
    },

    home: function(id){
      var onOlinAuth = function(){
        if (!this.Sidebar) {
          this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
          console.log("dz home Sidebar");
        }
        this.Page = new HomeView({el: $('#PageContainer')});
      }
      var onOlinErr = function(){
        //redirect to login page
        window.location.replace('/');
      }
      utils.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    free: function(id) {
      var onOlinAuth = function(){
          if (!this.Sidebar) {
              this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
          }
          this.Page = new SortFreeHomeView({el: $('#PageContainer')});
      }
      var onOlinErr = function(){
          //redirect to login page
          window.location.replace('/');
      }
      utils.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    account: function(){
        this.Page = new AccountView({el: $('#PageContainer')});
    },

    listing: function(id){
        if (!this.Sidebar){
            this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
        }
        console.log(ListingView);
        this.Page = new ListingView({el: $('#PageContainer'), id:id});
    },

    addListing: function () {
        var onOlinAuth = function(){
            if (!this.Sidebar) {
                this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
            }
            this.Page = new AddListingView({el: $('#PageContainer')});
        }
        var onOlinErr = function(){
            //redirect to login + alert user
            alert("Please log in to add an item")
            window.location.replace('/');
        }
        utils.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    pay: function (id){
      if (!this.Sidebar){
          this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
      }
      console.log(ListingView);
      this.Page = new PayView({el: $('#PageContainer'), id:id});
    },

    notFound: function(){
      this.Page = new NotFoundView({el: $('#PageContainer')});
    },

  });

  Backbone.pubSub = _.extend({}, Backbone.Events);
  var router = new Router();
  Backbone.history.start();
});