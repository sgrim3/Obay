var AppRouter = Backbone.Router.extend({

    routes: {
        "" : "login",
        "home" : "home"
    },

    initialize: function () {
    },

    ensureOlinAuthenticated: function(onAuth,onErr){
        $.get('/isOlinAuthenticated')
            .done(function(data,status){
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
            if (!this.homeView){
                this.homeView = new HomeView();
            }
            $('#PageContainer').html(this.homeView.el);
        }
        var onOlinErr = function(){
            //redirect to login page
            window.location.replace('/');
        }
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    login: function(id){
        var onOlinAuth = function(){
            //redirect to home if user is logged in already
            window.location.replace('/#home');
        }
        var onOlinErr = function(){
            if (!this.loginView){
                this.loginView = new LoginView();
            }
            $('#PageContainer').html(this.loginView.el);
        }
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    }

});

//asynchronously load templates to increase speeds. To add templates to load, just add them in the list below.
utils.loadTemplate(['HomeView', 'LoginView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
