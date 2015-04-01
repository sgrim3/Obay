var AppRouter = Backbone.Router.extend({

    routes: {
        "" : "login",
        "home" : "home"
    },

    initialize: function () {
    },

    ensureOlinAuthenticated: function(onAuth,onErr,router){
        //router holds what the 'this' keyword would normally in this context. this is required because I couldn't get 'this' to reference what I needed in callback hell.
        $.get('/isOlinAuthenticated')
            .done(function(data){
                var isAuth = data.olinAuth;
                if (isAuth) {
                    onAuth(router);
                } else {
                    onErr(router);
                }
            })
            .error(function(){
                onErr(router);
            });
    },

    home: function(id){
        var onOlinAuth = function(router){
            if (!this.Sidebar) {
                this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
            }
            this.Page = new HomeView({el: $('#PageContainer')});
        }
        var onOlinErr = function(router){
            //redirect to login page
            window.location.replace('/');
        }
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr,this);
    },

    login: function(id){
        var onOlinAuth = function(router){
            //redirect to home if user is logged in already
            window.location.replace('/#home');
        }
        var onOlinErr = function(router){
            if (!this.Sidebar) {
                this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
            }
            this.Page = new LoginView({el: $('#PageContainer')});
        }
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr,this);
    }

});

//asynchronously load templates to increase speeds. To add templates to load, just add them in the list below.
utils.loadTemplate(['HomeView', 'LoginView', 'SidebarView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
