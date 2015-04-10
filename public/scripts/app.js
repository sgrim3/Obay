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
    'jquery'
  , 'backbone'
  , 'utils'

  , 'scripts/models/listing'
  , 'scripts/models/user'
  // , 'scripts/collections/feed'
  // , 'scripts/collections/freeFeed'

  // , 'scripts/views/DestroyableView'
  , 'scripts/views/AccountView'
  , 'scripts/views/AddListingView'
  // , 'scripts/views/CollapsedListingView'
  // , 'scripts/views/FeedView'
  , 'scripts/views/HomeView'
  , 'scripts/views/ListingView'
  , 'scripts/views/LoginView'
  // , 'scripts/views/NotFoundView'
  // , 'scripts/views/PayView'
  // , 'scripts/views/PopoverAddListingView'
  , 'scripts/views/SidebarView'
  , 'scripts/views/SortFreeHomeView'
], function(
    $
  , Backbone
  , utils

  // FIXME: Naming convention standardization.
  , Listing
  , UserModel
  // , FeedCollection
  // , FreeFeedCollection

  // , DestroyableView
  , AccountView
  , AddListingView
  // , CollapsedListingView
  // , FeedView
  , HomeView
  , ListingView
  , LoginView
  // , NotFoundView
  // , PayView
  // , PopoverAddListingView
  , SidebarView
  , SortFreeHomeView
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
        var self = this;
        if (!self.Sidebar) {
            self.Sidebar = new SidebarView();
            self.Sidebar.render({parentDiv:$('#SidebarContainer')});
        }
        if (self.Page) { self.Page.destroy();  self.Page = null };
        var model = new UserModel();
        self.Page = new AccountView({model:model});
        self.Page.render({parentDiv: $('#PageContainer')});
    },

    notFound: function(){
        var self = this;
        if (self.Page) { self.Page.destroy(); self.Page = null };
        self.Page = new NotFoundView();
        self.Page.render({parentDiv: $('#PageContainer')});
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
        var self = this;
        var onOlinAuth = function(){
            if (!self.Sidebar) {
                self.Sidebar = new SidebarView();
                self.Sidebar.render({parentDiv:$('#SidebarContainer')});
            }
            if (self.Page) { self.Page.destroy(); self.Page = null; };
            self.Page = new HomeView();
            self.Page.render({parentDiv: $('#PageContainer')});
        }
        var onOlinErr = function(){
            //redirect to login page
            window.location.replace('/');
        }
        self.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    free: function(id) {
        var self = this;
        var onOlinAuth = function(){
            if (!self.Sidebar) {
                self.Sidebar = new SidebarView();
                self.Sidebar.render({parentDiv:$('#SidebarContainer')});
            }
            if (self.Page) { self.Page.destroy(); self.Page = null; };
            self.Page = new SortFreeHomeView();
            self.Page.render({parentDiv: $('#PageContainer')});
        }
        var onOlinErr = function(){
            //redirect to login page
            window.location.replace('/');
        }
        self.ensureOlinAuthenticated(onOlinAuth,onOlinErr);

    },

    addListing: function () {
        var self = this;
        var onOlinAuth = function(){
            if (!self.Sidebar) {
                self.Sidebar = new SidebarView();
                self.Sidebar.render({parentDiv:$('#SidebarContainer')});
            }
            if (self.Page) { self.Page.destroy(); self.Page = null; };
            self.Page = new AddListingView();
            self.Page.render({parentDiv: $('#PageContainer')});
        }
        var onOlinErr = function(){
            window.location.replace('/');
        }
        self.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },


    listing: function(id){
        var self = this;
        if (!self.Sidebar){
            self.Sidebar = new SidebarView();
            self.Sidebar.render({parentDiv:$('#SidebarContainer')});
        }
        if (self.Page) { self.Page.destroy(); self.Page = null; };
        var model = new Listing({id: id});
        self.Page = new ListingView({model: model});
        self.Page.render({parentDiv: $('#PageContainer')});
    },

    pay: function (id){
        var self = this;
        if (!self.Sidebar){
            self.Sidebar = new SidebarView();
            self.Sidebar.render({parentDiv:$('#SidebarContainer')});
        }
        if (self.Page) { self.Page.destroy(); self.Page = null; };
        self.Page = new PayView();
        self.Page.render({parentDiv: $('#PageContainer')});
    },

    login: function(id){
        var self = this;
        var onOlinAuth = function(){
            //redirect to home if user is logged in already
            window.location.replace('/#home');
        }
        var onOlinErr = function(){
            if (self.Page) { self.Page.destroy(); self.Page = null; };
            self.Page = new LoginView();
            self.Page.render({parentDiv: $('#PageContainer')});
        }
        self.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    logout: function (id){
        var self = this;
        $.post('/logout')
            .done(function (){
                //destroy everything completely, we are redirecting to login page which doesn't need page/sidebar mounts to display
                if (self.Page) { self.Page.destroy(); self.Page = null; };
                if (self.Sidebar) { self.Sidebar.destroy(); self.Sidebar = null; };
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
