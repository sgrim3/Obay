/*
Backbone router
checks in each route if user is logged into OlinApps using ensureOlinAuthenticated 
*/

define('jquery', [], function() {
  return jQuery;
});

window.socket = io.connect(window.location.hostname);

window.dataHolder = {};

// Configure external dependencies.
requirejs.config({
  baseUrl: "",
  paths: {
    jquery: "scripts/libs/jquery/dist/jquery",
    underscore: "scripts/libs/underscore/underscore",
    backbone: "scripts/libs/backbone/backbone",
    text: "scripts/libs/text/text",
    dropzone: "scripts/libs/dropzone"
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
  , 'scripts/models/listing'
  , 'scripts/models/user'
  , 'scripts/views/AccountView'
  , 'scripts/views/AddListingView'
  , 'scripts/views/EditListingView'
  , 'scripts/views/HomeView'
  , 'scripts/views/ListingView'
  , 'scripts/views/LoginView'
  , 'scripts/views/NotFoundView'
  // , 'scripts/views/PayView'
  // , 'scripts/views/PopoverAddListingView'
  , 'scripts/views/SidebarView'
], function(
    $
  , Backbone
  // FIXME: Naming convention standardization.
  , Listing
  , UserModel
  , AccountView
  , AddListingView
  , EditListingView
  , HomeView
  , ListingView
  , LoginView
  , NotFoundView
  // , PayView
  // , PopoverAddListingView
  , SidebarView
  )
{
  var Router = Backbone.Router.extend({
    routes: {
      "": "login",
      'home': 'home',
      'free': 'free',
      'feed?*queryString' : 'feed',
      "account": "account",
      "addListing": "addListing",
      "editListing/:id": "editListing",
      "logout": "logout",
      "listing/:id" : "listing",
      "user/:id" : "user",
      "temporaryPayRoute": "pay",
      // This route must go last to act as the catchall/404 page.
      '*notFound': 'notFound'
    },

    initialize: function() {
      this.userModel = new UserModel();
      this.on('all', function(routeEvent) {
        //TODO: explain to dennis what this is about. It doesn't seem very elegant
        //and moves what seems like css styling to a random try catch statement.
        //what's the reason for this?
        try {
          document.getElementById("addButton").style.display="inline";
        } catch (err) {}
      });
    },

    ensureOlinAuthenticated: function ensureOlinAuthenticated(onAuth,onErr){
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

    // Helper to convert input into a query.
    parseQueryString: function parseQueryString(queryString) {
      var params = {};
      if(queryString){
        _.each(
          _.map(decodeURI(queryString).split(/&/g),function(el,i) {
            var aux = el.split('='), o = {};
            if(aux.length >= 1){
              var val = undefined;
              if(aux.length == 2)
                  val = aux[1];
              o[aux[0]] = val;
            }
            return o;
          }),
          function(o){
            _.extend(params,o);
          } 
        );
      }
      Object.keys(params).forEach(function(key){
        var val = params[key];
        if (!isNaN(val)){
          params[key] = Number(val);
        }
      })
      return params;
    },

    createSidebar: function createSidebar() {
      if (!this.Sidebar) {
        this.Sidebar = new SidebarView({parentDiv:$('#SidebarContainer')});
      }
    },

    notFound: function notFound(){
      if (this.Page) { this.Page.destroy(); this.Page = null };
      this.Page = new NotFoundView({parentDiv: $('#PageContainer')});
    },

    home: function home(){
      var criteria = {
        listing_open: true,
      };
      this.feed(criteria);
    },

    free: function free(){
      var criteria = {
        listing_price: 0,
      };
      this.feed(criteria);
    },

    user: function user(id){
      var criteria = {
        listing_creator: id,
        listing_open: true,
      };
      this.feed(criteria);
    },

    feed: function feed(criteria){
      var _this = this;
      var onOlinAuth = function(){
        _this.createSidebar();
        if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
          _this.Page = new HomeView({
          parentDiv:$('#PageContainer'),
          criteria: criteria,
        });
      }
      var onOlinErr = function(){
        // Redirect to login page.
        window.location.replace('/');
      }
      _this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    feedQueryString: function feedQueryString(queryString){
      //this feedQueryString function takes a query string to create and display a feed.
      var criteria = this.parseQueryString(queryString);
      this.feed(criteria);
    },

    account: function(){
      var _this = this;
      var onOlinAuth = function(){
        _this.createSidebar();
        if (_this.Page) { _this.Page.destroy(); _this.Page = null; };

        // QUESTION: Should a userModel be declared here?
        // Also, should this be checked to determine if the user already exists?
        
        _this.Page = new AccountView({
          parentDiv: $('#PageContainer'),
          model: _this.userModel,
          PORT: window.location.host
        });
      }

      var onOlinErr = function(){
        window.location.replace('/');
      }

      _this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    addListing: function () {
      var onOlinAuth = function(){
        this.createSidebar();
        if (this.Page) { this.Page.destroy(); this.Page = null; };
        
        this.Page = new AddListingView({parentDiv: $('#PageContainer')});
      }

      var onOlinErr = function(){
        window.location.replace('/');
      }

      this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    editListing: function editListing(_id) {
      var _this = this;
      var onOlinAuth = function(){
        _this.createSidebar();
        if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
        
        var listing = new Listing({_id: _id});
        _this.Page = new EditListingView({
          model:listing, 
          parentDiv: $('#PageContainer')
        });
      }

      var onOlinErr = function(){
        window.location.replace('/');
      }

      this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },


    listing: function listing(_id) {
      this.createSidebar();
      if (this.Page) { this.Page.destroy(); this.Page = null; };
      var listing = new Listing({_id: _id});
      this.Page = new ListingView({
        model: listing, 
        parentDiv: $('#PageContainer')
      });
    },


    login: function(id){
      var _this = this;
      
      var onOlinAuth = function(){
          //redirect to home if user is logged in already
          window.location.replace('/#home');
      }

      var onOlinErr = function(){
          if (_this.Page) { _this.Page.destroy(); _this.Page = null; };
          _this.Page = new LoginView({parentDiv: $('#PageContainer')});
      }

      this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
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
