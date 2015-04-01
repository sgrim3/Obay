window.HomeView = Backbone.View.extend({

    initialize:function () {
        var thisView = this;
        $.get('/sessionData')
            .done(function(data){
                thisView.render(data);
            })
            .error(function(){
                thisView.render();
            });
    },

    render:function (template_data) {
        this.$el.html(this.template());
        return this;
    }

});
