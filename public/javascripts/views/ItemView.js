window.ItemView = Backbone.View.extend({

	initialize:function () {
        this.render();
    },

    render: function(options){

    	var itemView = this;
    	if(options.id){

    		this.item = new Listing({_id:options.id});
    		console.log(this.item);
	    	this.item.fetch({
	    		success: function(item){
	    			console.log(item);
	    			// $(this.el).html(this.template(item.model.attr);
	       //  		return this;
	    		},
	    		error: function(){
	    			console.log('error!');
	    		}

    	});
	    }
	    else{
	    	console.log('no object to look for');
	    }
    }
});