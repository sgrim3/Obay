var AppRouter = Backbone.Router.extend({

    routes: {
        "": "login",
        "home": "home",
        "addListing": "addListing",
        "logout": "logout",
        "item/:id" : "item",
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
            //redirect to login
            window.location.replace('/');
        }
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },


    item: function(id){
        if (!this.Sidebar){
            this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
        }
        this.Page = new ItemView({el: $('#PageContainer')});
    },

    login: function(id){

        var onOlinAuth = function(){
            //redirect to home if user is logged in already
            window.location.replace('/#home');
        }
        var onOlinErr = function(){
            if (!this.Sidebar) {
                this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
            }
            this.Page = new LoginView({el: $('#PageContainer')});
        }
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    logout: function (id){
        console.log("Logging out.");
        $.post('/logout')
            .done(function (){
                Backbone.history.navigate('', true);
            })
            .error(function(){
                console.log("Failed to log out.");
            });
    },
});

//asynchronously load templates to increase speeds. To add templates to load, just add them in the list below.
utils.loadTemplate(['HomeView', 'LoginView', 'AddListingView', 'SidebarView','NotFoundView', 'ListingView', 'ItemView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
