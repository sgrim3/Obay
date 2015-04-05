window.ItemView = Backbone.View.extend({

	events: {
	    'click .toggle-feeds-button': 'buyItem',
	},

	initialize:function (options) {
        this.render(options);
    },

    render: function(options){
    	console.log(options.id);
    	// $el=options.el;
    	if(options.id){

    		this.item = new Listing({id:options.id});
    		console.log(this.item);

    		var itemViewScope = this;

	    	this.item.fetch({
	    		//data: $.param(), 
	    		success: function(item){
	    			console.log(item.attributes);
	    			itemViewScope.$el.html(itemViewScope.template(item.attributes));
	         		return itemViewScope;
	    		},
	    		error: function(){
	    			console.log('error!');
	    		}

    	});
	    }
	    else{
	    	console.log('no object to look for');
	    }
    },

    buyItem: function(options){
    	
    }
});