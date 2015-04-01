var AppRouter = Backbone.Router.extend({

    routes: {
        "" : "login",
        "home" : "home"
    },

    initialize: function () {
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#PageContainer').html(this.homeView.el);
    },

    login: function (id) {
        if (!this.loginView) {
            this.loginView = new LoginView();
        }
        $('#PageContainer').html(this.loginView.el);
    },

});

//asynchronously load templates to increase speeds
utils.loadTemplate(['HomeView', 'LoginView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
