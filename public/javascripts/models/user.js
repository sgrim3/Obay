window.User = Backbone.Model.extend({
    defaults: {
        userId: '',
        olinAppsInfo: {},
        listings: []
    },
    //use userId to uniquely identify user objects
    idAttribute: 'userId',
    initialize: function (id) {
    
    },
    urlRoot:'127.0.0.1/3000/users'
});
