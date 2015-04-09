var AppRouter = Backbone.Router.extend({

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
        console.log('account route called!');
        if (!this.Sidebar) {
            this.Sidebar = new SidebarView();
            this.Sidebar.render({parentDiv:$('#SidebarContainer')});
        }
        console.log('account route!');
        console.log(this);
        console.log(this.Page);
        console.log(this.potato);
        if (this.Page) { this.Page.destroy();  this.Page = null };
        this.Page = new AccountView();
        this.Page.render({parentDiv: $('#PageContainer')});
    },

    notFound: function(){
        if (this.Page) { this.Page.destroy(); this.Page = null };
        this.Page = new NotFoundView();
        this.Page.render({parentDiv: $('#PageContainer')});
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
        var onOlinAuth = function(){
            if (!this.Sidebar) {
                this.Sidebar = new SidebarView();
                this.Sidebar.render({parentDiv:$('#SidebarContainer')});
            }
            if (this.Page) { this.Page.destroy(); this.Page = null };
            console.log(this);
            this.potato = 'eh';
            this.Page = new HomeView();
            this.Page.render({parentDiv: $('#PageContainer')});
            console.log('in home!');
            console.log(this.Page);
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
                this.Sidebar = new SidebarView();
                this.Sidebar.render({parentDiv:$('#SidebarContainer')});
            }
            if (this.Page) { this.Page.destroy(); this.Page = null };
            this.Page = new SortFreeHomeView();
            this.Page.render({parentDiv: $('#PageContainer')});
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
                this.Sidebar = new SidebarView();
                this.Sidebar.render({parentDiv:$('#SidebarContainer')});
            }
            if (this.Page) { this.Page.destroy(); this.Page = null };
            this.Page = new AddListingView();
            this.Page.render({parentDiv: $('#PageContainer')});
        }
        var onOlinErr = function(){
            window.location.replace('/');
        }
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },


    listing: function(id){
        if (!this.Sidebar){
            this.Sidebar = new SidebarView();
            this.Sidebar.render({parentDiv:$('#SidebarContainer')});
        }
        if (this.Page) { this.Page.destroy(); this.Page = null };
        this.Page = new ListingView();
        this.Page.render({parentDiv: $('#PageContainer')});
    },

    pay: function (id){
        if (!this.Sidebar){
            this.Sidebar = new SidebarView();
            this.Sidebar.render({parentDiv:$('#SidebarContainer')});
        }
        if (this.Page) { this.Page.destroy(); this.Page = null };
        this.Page = new PayView();
        this.Page.render({parentDiv: $('#PageContainer')});
    },

    login: function(id){

        var onOlinAuth = function(){
            //redirect to home if user is logged in already
            window.location.replace('/#home');
        }
        var onOlinErr = function(){
            if (this.Page) { this.Page.destroy(); this.Page = null };
            this.Page = new LoginView();
            this.Page.render({parentDiv: $('#PageContainer')});
        }
        this.ensureOlinAuthenticated(onOlinAuth,onOlinErr);
    },

    logout: function (id){
        console.log("Logging out.");
        $.post('/logout')
            .done(function (){
                //destroy everything completely, we are redirecting to login page which doesn't need page/sidebar mounts to display
                if (this.Page) { this.Page.destroy(); this.Page = null };
                if (this.Sidebar) { this.Sidebar.destroy(); this.Sidebar = null };
                Backbone.history.navigate("", true);
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
