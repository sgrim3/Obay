var AppRouter = Backbone.Router.extend({

    routes: {
        "": "login",
        "home": "home",
        "home/free":"home",
        "account": "account",
        "addListing": "addListing",
        "logout": "logout",
        "listing/:id" : "listing",
        "temporaryPayRoute": "pay",
        '*notFound': 'notFound' // This route must go last to act as the catchall/404 page.
    },

    initialize: function () {
    },

    account: function(){
        this.Page = new AccountView({el: $('#PageContainer')});
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

    free: function(id) {
        var onOlinAuth = function(){
            if (!this.Sidebar) {
                this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
            }
            this.Page = new FreeHomeView({el: $('#PageContainer')});
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
        //console.log(ListingView);
        this.Page = new ListingView({el: $('#PageContainer'), id:id});
    },

    pay: function (id){
        // if (!this.Sidebar){
        //     this.Sidebar = new SidebarView({el: $('#SidebarContainer')});
        // }
        //console.log(ListingView);
        // this.Page = new PayView({el: $('#PageContainer'), id:id});
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

// Find all the views that we have.
var scripts = document.getElementsByTagName("script");
var viewList = [];
for (var i=0; i<scripts.length; i++) {
    if (scripts[i].src && (scripts[i].src.indexOf("views") > -1)) {

        // Janky parsing for all the views that we own.
        var currentView = scripts[i].src.split('/').pop(-1);
        currentView = currentView.split('.')[0];
        viewList.push(currentView);
    }
}

//asynchronously load templates to increase speeds. To add templates to load, just add them in the list below.
utils.loadTemplate(viewList, function() {
    //the line below creates a global object that views listen to/broadcoast events to.
    Backbone.pubSub = _.extend({}, Backbone.Events);
    app = new AppRouter();
    Backbone.history.start();
});
