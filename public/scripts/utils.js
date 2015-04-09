// parts taken from winecellar node app: https://github.com/ccoenraets/nodecellar/blob/master/public/js/utils.js
// this is black magic we need not touch that helps us load templates.
window.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplate: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (window[view]) {
                deferreds.push($.get('templates/' + view + '.html', function(data) {
                    //in this line, views are associated with templates of the same name. so templates and views must have the same name for this automagic association to happen.
                    window[view].prototype.template = _.template(data);
                }));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

}

