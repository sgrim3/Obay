window.ItemListingView = Backbone.View.extend({

	initialize:function () {
        this.item = new Listing();
    },

    render: function(){
    	var itemView = this;
    	this.item.fetch({
    		success: function(){
    			console.log(item.model.atte)
    			// $(this.el).html(this.template(item.model.attr);
       //  		return this;
    		},
    		error: function(){
    			console.log('error!');
    		}

    	});
    }
});