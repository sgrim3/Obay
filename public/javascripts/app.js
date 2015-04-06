var AppRouter = Backbone.Router.extend({

    routes: {
        "": "login",
        "home": "home",
        "addListing": "addListing",
        "logout": "logout",
        "listing/:id" : "listing",
        '*notFound': 'notFound' // This route must go last to act as the catchall/404 page.
    },

    initialize: function () {
    },

    notFound: function(){
        this.Page = new NotFoundView({el: $('#PageContainer')});
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

    home: function(id){
        var onOlinAuth = function(){
            if (!this.Sidebar) {
                this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
            }
            this.Page = new HomeView({el: $('#PageContainer')});
        }
        var onOlinErr = function(){
            //redirect to login page
            window.location.replace('/');
        }
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
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
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },


    listing: function(id){
        if (!this.Sidebar){
            this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
        }
        this.Page = new ListingView({el: $('#PageContainer'), id:id});
    },

    login: function(id){

        var onOlinAuth = function(){
            //redirect to home if user is logged in already
            window.location.replace('/#home');
        }
        var onOlinErr = function(){
            this.Page = new LoginView({el: $('#PageContainer')});
        }
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
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
});

//asynchronously load templates to increase speeds. To add templates to load, just add them in the list below.
utils.loadTemplate(['HomeView', 'LoginView', 'AddListingView', 'SidebarView','NotFoundView', 'ListingView', 'CollapsedListingView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
