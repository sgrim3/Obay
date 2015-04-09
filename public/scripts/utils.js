define(['jquery'], function ($){
    console.log('dz in utils.js');
    var utils = {
        // Asynchronously load templates located in separate .html files.
        loadTemplate: function(views, callback) {
            var deferreds = [];
            $.each(views, function(index, view) {
                if (window[view]) {
                    deferreds.push($.get('templates/' + view + '.html', function(data) {
                        // In this line, views are associated with templates of the same name. so templates and views must have the same name for this automagic association to happen.
                        window[view].prototype.template = _.template(data);
                    }));
                } else {
                    alert(view + " not found");
                }
            });
            $.when.apply(null, deferreds).done(callback);
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
    };

    return utils;
});