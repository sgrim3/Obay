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
  , 'scripts/views/EditListingView'
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
  , EditListingView
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
      "editListing/:id": "editListing",
      "logout": "logout",
      "listing/:id" : "listing",
      "temporaryPayRoute": "pay",
      // This route must go last to act as the catchall/404 page.
      '*notFound': 'notFound'
    },

    account: function(){
      if (!this.Sidebar) {
        this.Sidebar = new SidebarView({parentDiv:$('#SidebarContainer')});
      }
      if (this.Page) {
        this.Page.destroy();
        this.Page = null 
      };

      // QUESTION: Should a userModel be declared here?
      // Also, should this be checked to determine if the user already exists?
      var userModel = new UserModel();
      
      this.Page = new AccountView({model: userModel});
    },

    notFound: function(){
      var _this = this;
      if (_this.Page) { _this.Page.destroy(); _this.Page = null };
      _this.Page = new NotFoundView();
      _this.Page.render({parentDiv: $('#PageContainer')});
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
        var _this = this;
        var onOlinAuth = function(){
            if (!_this.Sidebar) {
                _this.Sidebar = new SidebarView({
                  parentDiv:$('#SidebarContainer')
                });
            }
            if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
            _this.Page = new HomeView({parentDiv:$('#PageContainer')});
        }
        var onOlinErr = function(){
            // Redirect to login page.
            window.location.replace('/');
        }
        _this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    free: function(id) {
        var _this = this;
        var onOlinAuth = function(){
            if (!_this.Sidebar) {
                _this.Sidebar = new SidebarView({
                  parentDiv:$('#SidebarContainer')
                });
            }
            if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
            _this.Page = new SortFreeHomeView();
            _this.Page.render({parentDiv: $('#PageContainer')});
        }
        var onOlinErr = function(){
            //redirect to login page
            window.location.replace('/');
        }
        _this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);

    },

    addListing: function () {
        var _this = this;
        var onOlinAuth = function(){
            if (!_this.Sidebar) {
                _this.Sidebar = new SidebarView({
                  parentDiv:$('#SidebarContainer')
                });
            }
            if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
            _this.Page = new AddListingView({parentDiv: $('#PageContainer')});
        }
        var onOlinErr = function(){
            window.location.replace('/');
        }
        _this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    editListing: function(id) {
        var _this = this;
        var onOlinAuth = function(){
            if (!_this.Sidebar) {
                _this.Sidebar = new SidebarView({
                  parentDiv:$('#SidebarContainer')
                });
            }
            if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
            var model = new Listing({id: id});
            _this.Page = new EditListingView({model:model});
            _this.Page.render({parentDiv: $('#PageContainer'), model:model});
        }
        var onOlinErr = function(){
            window.location.replace('/');
        }
        _this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },


    listing: function(id){
        var _this = this;
        if (!_this.Sidebar){
            _this.Sidebar = new SidebarView({parentDiv:$('#SidebarContainer')});
        }
        if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
        var model = new Listing({id: id});
        _this.Page = new ListingView({model: model});
        _this.Page.render({parentDiv: $('#PageContainer')});
    },

    pay: function (id){
        var _this = this;
        if (!_this.Sidebar){
            _this.Sidebar = new SidebarView({parentDiv:$('#SidebarContainer')});
        }
        if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
        _this.Page = new PayView();
        _this.Page.render({parentDiv: $('#PageContainer')});
    },

    login: function(id){
        var _this = this;
        var onOlinAuth = function(){
            //redirect to home if user is logged in already
            window.location.replace('/#home');
        }
        var onOlinErr = function(){
            if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
            _this.Page = new LoginView();
            _this.Page.render({parentDiv: $('#PageContainer')});
        }
        _this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    logout: function (id){
        var _this = this;
        $.post('/logout')
            .done(function (){
                /*Destroy everything completely, we are redirecting to login 
                page which doesn't need page/sidebar mounts to display.*/
                if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
                if (_this.Sidebar) { 
                  _this.Sidebar.destroy(); 
                  _this.Sidebar = null; 
                };
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