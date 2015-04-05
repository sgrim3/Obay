window.ItemView = Backbone.View.extend({

	events: {
	    'click .buyButton': 'buyItem',
	},

	initialize:function (options) {
        this.render(options);
    },

    render: function(options){
    	console.log(options.id);

    	//if there's an item id in the url, gets the item model
    	//and makes an api call
    	if(options.id){
    		this.item = new Listing({id:options.id});
    		console.log(this.item);
			var itemViewScope = this; //BECAUSE ASYNC! DO THIS ALWAYS!

	    	this.item.fetch({
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
	    	console.log('This item does not exist');
	    }
    },

    buyItem: function(options){
    	if(options.id){
    		this.item = new Listing({id:options.id});
    		var itemViewScope = this;

    		this.item.set({
    			item_open: false
    			success: function(){
    				console.log(this.item);
    			}
    			error: function(){
    				console.log('this isnt async breh')
    			}
		    	
    		});

    		// this.item.save({

    		// });

    	}
    }

});