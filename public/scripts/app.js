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

  'scripts/views/DestroyableView',
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

  // FIXME: Naming convention standardization.
  Listing,
  UserModel,
  FeedCollection,
  FreeFeedCollection,

  DestroyableView,
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
      "home": "home",
      "home/free":"free",
      "account": "account",
      "addListing": "addListing",
      "logout": "logout",
      "listing/:id" : "listing",
      "temporaryPayRoute": "pay",
      '*notFound': 'notFound' // This route must go last to act as the catchall/404 page.
    },

    account: function(){
        var router = this;
        if (!router.Sidebar) {
            router.Sidebar = new SidebarView();
            router.Sidebar.render({parentDiv:$('#SidebarContainer')});
        }
        if (router.Page) { router.Page.destroy();  router.Page = null };
        router.Page = new AccountView();
        router.Page.render({parentDiv: $('#PageContainer')});
    },

    notFound: function(){
        var router = this;
        if (router.Page) { router.Page.destroy(); router.Page = null };
        router.Page = new NotFoundView();
        router.Page.render({parentDiv: $('#PageContainer')});
    },

    ensureOlinAuthenticated: function(onAuth,onErr){
        $.get('/isOlinAuthenticated')
            .done(function(data){
                var isAuth = data.olinAuth;
                if (isAuth) {
                    onAuth();
                } else {
                    onErr();
                }
            })
            .error(function(){
                onErr();
            });
    },

    home: function(){
        var router = this;
        var onOlinAuth = function(){
            if (!router.Sidebar) {
                router.Sidebar = new SidebarView();
                router.Sidebar.render({parentDiv:$('#SidebarContainer')});
            }
            if (router.Page) { router.Page.destroy(); router.Page = null; };
            router.Page = new HomeView();
            router.Page.render({parentDiv: $('#PageContainer')});
        }
        var onOlinErr = function(){
            //redirect to login page
            window.location.replace('/');
        }
        router.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    free: function(id) {
        var router = this;
        var onOlinAuth = function(){
            if (!router.Sidebar) {
                router.Sidebar = new SidebarView();
                router.Sidebar.render({parentDiv:$('#SidebarContainer')});
            }
            if (router.Page) { router.Page.destroy(); router.Page = null; };
            router.Page = new SortFreeHomeView();
            router.Page.render({parentDiv: $('#PageContainer')});
        }
        var onOlinErr = function(){
            //redirect to login page
            window.location.replace('/');
        }
        router.ensureOlinAuthenticated(onOlinAuth,onOlinErr);

    },

    addListing: function () {
        var router = this;
        var onOlinAuth = function(){
            if (!router.Sidebar) {
                router.Sidebar = new SidebarView();
                router.Sidebar.render({parentDiv:$('#SidebarContainer')});
            }
            if (router.Page) { router.Page.destroy(); router.Page = null; };
            router.Page = new AddListingView();
            router.Page.render({parentDiv: $('#PageContainer')});
        }
        var onOlinErr = function(){
            window.location.replace('/');
        }
        router.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },


    listing: function(id){
        var router = this;
        if (!router.Sidebar){
            router.Sidebar = new SidebarView();
            router.Sidebar.render({parentDiv:$('#SidebarContainer')});
        }
        if (router.Page) { router.Page.destroy(); router.Page = null; };
        var model = new Listing({id: id});
        router.Page = new ListingView({model: model});
        router.Page.render({parentDiv: $('#PageContainer')});
    },

    pay: function (id){
        var router = this;
        if (!router.Sidebar){
            router.Sidebar = new SidebarView();
            router.Sidebar.render({parentDiv:$('#SidebarContainer')});
        }
        if (router.Page) { router.Page.destroy(); router.Page = null; };
        router.Page = new PayView();
        router.Page.render({parentDiv: $('#PageContainer')});
    },

    login: function(id){
        var router = this;
        var onOlinAuth = function(){
            //redirect to home if user is logged in already
            window.location.replace('/#home');
        }
        var onOlinErr = function(){
            if (router.Page) { router.Page.destroy(); router.Page = null; };
            router.Page = new LoginView();
            router.Page.render({parentDiv: $('#PageContainer')});
        }
        router.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    logout: function (id){
        var router = this;
        $.post('/logout')
            .done(function (){
                //destroy everything completely, we are redirecting to login page which doesn't need page/sidebar mounts to display
                if (router.Page) { router.Page.destroy(); router.Page = null; };
                if (router.Sidebar) { router.Sidebar.destroy(); router.Sidebar = null; };
                Backbone.history.navigate("", true);
            })
            .error(function(){
                console.log("Failed to log out.");
            });
    },

  });

  Backbone.pubSub = _.extend({}, Backbone.Events);
  var router = new Router();
  Backbone.history.start();
});